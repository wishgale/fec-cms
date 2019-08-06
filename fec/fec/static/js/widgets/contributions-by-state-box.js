'use strict';

/**
 * TODO - Loading state?
 * TODO - Error message and state: Selected candidate wasn't a candidate for selected year — DONE?
 * TODO - Error message and state: Selected year isn't an option for selected candidate — DONE?
 * TODO - When the year is changed, double-check against current candidate before requesting data — DONE?
 * TODO - Default election_year from url on initial load (widgets macro?) — DONE?
 * TODO - If user chooses non-President, allow two-year election years
 * TODO - From ^^, if a senate candidate is chosen, the candidate's details will have those election cycle years included
 * TODO - Apply data to map
 * TODO - Map legend
 * TODO - Make the datestamp above the state list work — DONE?
 * TODO - Add analytics
 * TODO - Figure out why Aggregate Totals Box isn't defaulting to data-year and window.ELECTION_YEAR
 * TODO - For v2 or whatever, convert to datatable (start with the simpliest implementation; no columns.js, etc.)
 * TODO - Stop the pull-downs from changing the URL?
 * TODO - Make Typeahead save current value and restore if user clicks outside?
 */
/* global document, context */

/**
 * Based on /fec/static/js/pages/elections.js
 */

// Editable vars
const stylesheetPath = '/static/css/widgets/contributions-by-state.css';
// const breakpointToXS = 0; // retaining just in case
const breakpointToSmall = 430;
const breakpointToMedium = 675;
const breakpointToLarge = 700;
const breakpointToXL = 860;

const $ = require('jquery');
// const _ = require('underscore');

import { buildUrl } from '../modules/helpers';
// const maps = require('../modules/maps');

// const electionUtils = require('../modules/election-utils');
// const helpers = require('../modules/helpers');
// const ElectionForm = require('../modules/election-form').ElectionForm;
// import ElectionForm from '../modules/election-form';

import typeahead from '../modules/typeahead';

const DataMap = require('../modules/election-map').DataMap;


import {
  defaultElectionYear,
  // electionYearsOptions,
  // officeDefs
} from './widget-vars';

/**
 * Formats the given value and puts it into the dom element.
 * @param {Number} passedValue - The number to format and plug into the element
 * @param {Boolean} roundToWhole - Should we drop the cents or no?
 * @returns {String} A string of the given value formatted with a dollar sign, commas, and (if roundToWhole === false) decimal
 */
function formatAsCurrency(passedValue, roundToWhole = true) {
  // Format for US dollars and cents
  if (roundToWhole)
    return '$' + passedValue.toFixed().replace(/\d(?=(\d{3})+$)/g, '$&,');
  else return '$' + passedValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

/**
 * @param {HTMLSelectElement} yearControl - Set with data-year-control on <script> but not required if data-election-year is set.
 */
function ContributionsByState() {
  this.fetchAbortController = new AbortController();
  this.fetchAbortSignal = this.fetchAbortController.signal;

  // Where to find individual candidate details
  this.basePath_candidatePath = ['candidate'];
  // Where to find the highest-earning candidates:
  this.basePath_highestRaising = ['candidates', 'totals'];
  // Where to find the list of states:
  this.basePath_states = ['schedules', 'schedule_a', 'by_state', 'by_candidate'];
  // Where to find the states list grand total:
  this.basePath_statesTotal = ['schedules', 'schedule_a', 'by_state', 'by_candidate', 'totals'];
  // Details about the candidate. Comes from the typeahead
  this.candidateDetails = {};
  // Init the list/table of states and their totals
  this.data_states;
  this.element = document.querySelector('#gov-fec-contribs-by-state');
  // Are we waiting for data?
  this.fetchingStates = false;
  this.map;
  this.candidateDetailsHolder;
  this.table;
  this.statesTotalHolder;
  // The typeahead candidate element:
  this.typeahead;
  // The <select> for election years:
  this.yearControl;

  // Populate the examples text because handlebars doesn't like to
  document.querySelector('#gov-fec-contribs-by-state .typeahead-filter .filter__instructions').innerHTML = 'Examples: <em>Bush, George W</em> or <em>P00003335</em>';

  // If we have the element on the page, fire it up
  if (this.element) this.init();
}

/**
 * 
 */
ContributionsByState.prototype.init = function() {
  // Add the stylesheet to the document <head>
  let head = document.head;
  let linkElement = document.createElement('link');
  linkElement.type = 'text/css';
  linkElement.rel = 'stylesheet';
  linkElement.href = stylesheetPath;
  head.appendChild(linkElement);
  
  // Init the typeahead
  this.typeahead = new typeahead.Typeahead('#contribs-by-state-cand', 'candidates');
  // this.typeahead.$element.css({ height: 'auto' });
  // Override the default Typeahead behavior and add our own handler
  this.typeahead.$input.off('typeahead:select');
  this.typeahead.$input.on('typeahead:select', this.handleTypeaheadSelect.bind(this));

  // Init the election year selector (The element ID is set in data/templates/partials/widgets/contributions-by-state.jinja)
  this.yearControl = document.querySelector('#state-contribs-years');
  this.yearControl.addEventListener(
    'change',
    this.handleElectionYearChange.bind(this)
  );
  this.baseCandidateQuery = {

  };
  this.baseStatesQuery = {
    // candidate_id: '', // 'P60007168',// TODO - remove this
    cycle: defaultElectionYear(),
    election_full: true,
    // is_active_candidate: true,
    office: 'P',
    page: 1,
    per_page: 200,
    sort_hide_null: false,
    sort_null_only: false,
    sort_nulls_last: false
    // sort: 'total'
  };

  this.map = $('.map-wrapper .election-map');
  this.candidateDetailsHolder = document.querySelector('.candidate-details');
  this.table = document.querySelector('.state-list-wrapper table');
  this.statesTotalHolder = document.querySelector('.js-states-total');

  this.map = new DataMap(this.map.get(0), {
    drawStates: true,
    handleSelect: this.handleMapSelect.bind(this)
  });

  // var districtMap = new maps.DistrictMap($('#election-map').get(0), {
  //   color: '#36BDBB'
  // });
  // districtMap.load(context.election);

  // Listen for resize events
  window.addEventListener('resize', this.handleResize.bind(this));
  // Call for a resize on init
  this.handleResize();

  this.loadInitialData();
}

/**
 * 
 */
ContributionsByState.prototype.loadInitialData = function() {
  console.log('loadInitialData');
  let instance = this;

  let highestRaisingQuery = Object.assign({}, this.baseStatesQuery, {
    sort: '-receipts',
    per_page: 1,
    sort_hide_null: true
  });

  console.log('about to query this', highestRaisingQuery);
  window
    .fetch(buildUrl(this.basePath_highestRaising, highestRaisingQuery), {
      cache: 'no-cache',
      mode: 'cors',
      signal: null
    })
    .then(function(response) {
      if (response.status !== 200)
        throw new Error('The network rejected the states request.');
      // else if (response.type == 'cors') throw new Error('CORS error');
      response
        .json()
        .then(data => {
          console.log('loadInitialData then() ', data);
          instance.data_candidate = data;
          instance.candidateDetails = data.results[0];
          instance.baseStatesQuery.candidate_id = instance.candidateDetails.candidate_id;
          instance.displayUpdatedData_candidate();
          instance.loadStatesData();
        });
    })
    .catch(function() {
      // TODO - handle catch
    });
}

/**
 * Load Candidate details
 */
ContributionsByState.prototype.loadCandidateDetails = function(cand_id) {
  let instance = this;
  
  this.basePath_candidatePath[1] = cand_id;
  window
    .fetch(buildUrl(this.basePath_candidatePath, this.baseCandidateQuery), {
      cache: 'no-cache',
      mode: 'cors',
      signal: null
    })
    .then(function(response) {
      if (response.status !== 200)
        throw new Error('The network rejected the states request.');
      // else if (response.type == 'cors') throw new Error('CORS error');
      response
        .json()
        .then(data => {
          console.log('loadCandidateDetails then() ', data);
          instance.data_candidate = data;
          instance.candidateDetails = data.results[0];
          instance.baseStatesQuery.candidate_id = instance.candidateDetails.candidate_id;
          instance.baseStatesQuery.office = instance.candidateDetails.office;
          instance.displayUpdatedData_candidate();
          if (instance.validateCandidateVsElectionYear()) instance.loadStatesData();
        });
    })
    .catch(function() {
      // TODO - handle catch
    });
}

/**
 * Starts the data load, called by {@see init}
 * @param {Object} query - The data object for the query, {@see baseStatesQuery}
 */
ContributionsByState.prototype.loadStatesData = function() {
  console.log('loadStatesData');
  let instance = this;
  // let table = this.table.DataTable();

  let baseStatesQueryWithCandidate = Object.assign({}, this.baseStatesQuery, {candidate_id: this.candidateDetails.candidate_id});

  // Let's stop any currently-running states fetches
  if (this.fetchingStates) this.fetchAbortController.abort();
  // Start loading the states data
  this.fetchingStates = true;
  this.setLoadingState(true);
  console.log('about to request states data with this: ', baseStatesQueryWithCandidate);
  window
    .fetch(buildUrl(this.basePath_states, baseStatesQueryWithCandidate), {
      cache: 'no-cache',
      mode: 'cors',
      signal: this.fetchAbortSignal
    })
    .then(function(response) {
      console.log('fetch.then(response): ', response);
      instance.fetchingStates = false;
      if (response.status !== 200)
        throw new Error('The network rejected the states request.');
      // else if (response.type == 'cors') throw new Error('CORS error');
      response.json().then(data => {
        console.log('LOADED THE STATES DATA: ', data);

        // Now that we have all of the values combined, let's sort them by total, descending
        data.results.sort((a, b) => {
          return b.total - a.total;
        });

        // data.results = [...newResults];
        // data.results = data.results;
        instance.data_states = data;
        instance.displayUpdatedData_states();
      });
    })
    .catch(function(e) {
      instance.fetchingStates = false;
      // console.log('fetch.catch(e): ', e);
      // console.log('e.code: ', e.code);
      // console.log('e.message: ', e.message);
      // console.log('e.name: ', e.name);
      // TODO - handle catch
    });
  
  // Start loading the states total
  window
    .fetch(buildUrl(this.basePath_statesTotal, baseStatesQueryWithCandidate), {
      cache: 'no-cache',
      mode: 'cors',
      signal: null
    })
    .then(function(response) {
      console.log('second fetch then: ', response);
      if (response.status !== 200)
        throw new Error('The network rejected the states total request.');
      // else if (response.type == 'cors') throw new Error('CORS error');
      response.json().then(data => {
        instance.displayUpdatedData_total(data);
      });
    })
    .catch(function(e) {
      console.log('second fetch catch e:', e);
      // TODO - handle catch
    });
};

/**
 * 
 */
ContributionsByState.prototype.displayUpdatedData_candidate = function() {
  console.log('displayUpdatedData_candidate()');
  console.log('candidateDetails: ', this.candidateDetails);
  
  // If this is the first load, the typeahead won't have a value; let's set it
  let theTypeahead = document.querySelector('#contribs-by-state-cand');
  if (!theTypeahead.value) theTypeahead.value = this.candidateDetails.name;

  // The block where the candidate details are
  // let candidateDetailsHolder = document.querySelector('.candidate-details');
  
  let candidateNameElement = this.candidateDetailsHolder.querySelector('h1');
  candidateNameElement.innerHTML = `<a href="/data/candidate/${this.candidateDetails.candidate_id}/?cycle=${this.baseStatesQuery.cycle}&election_full=true">${this.candidateDetails.name}</a> [${this.candidateDetails.party}]`;

  let candidateIdHolder = this.candidateDetailsHolder.querySelector('h3');
  candidateIdHolder.innerText = 'ID: ' + this.candidateDetails.candidate_id;

}

/**
 * 
 */
ContributionsByState.prototype.displayUpdatedData_states = function() {
  console.log('displayUpdatedData_states()');
  
  // console.log('this.data_states: ', this.data_states);
  let theResults = this.data_states.results;
  let theTableBody = this.table.querySelector('tbody');
  let theTbodyString = '';
  
  console.log('theResults: ', theResults);

  for (var i = 0; i < theResults.length; i++) {
    theTbodyString += `<tr><td>${i+1}.</td><td>${theResults[i].state_full}</td><td class="t-right-aligned t-mono">${formatAsCurrency(theResults[i].total, true)}</td></tr>`;
  }
  theTableBody.innerHTML = theTbodyString;

  this.updateCycleTimeStamp();
  this.setLoadingState(false); // TODO - May want to move this elsewhere
  
  // maps.initStateMaps(this.data_states);
}

/**
 * @param {Object} data
 */
ContributionsByState.prototype.displayUpdatedData_total = function(data) {
  // console.log('displayUpdatedData_total()', data);
  this.statesTotalHolder.innerText = formatAsCurrency(data.results[0].total);
}

/**
 * 
 */
ContributionsByState.prototype.updateCycleTimeStamp = function() {
  // TODO - account for non-presidential election cycles
  let electionYear = this.baseStatesQuery.cycle;

  let theStartTimeElement = document.querySelector('.js-cycle-start-time');
  let theEndTimeElement = document.querySelector('.js-cycle-end-time');
  
  let theStartDate = new Date((electionYear - 4), 1, 1);
  theStartTimeElement.setAttribute('datetime', theStartDate.getFullYear() + '-01-01');
  theStartTimeElement.innerText = `01/01/${theStartDate.getFullYear()}`;

  let theEndDate = new Date(electionYear, 1, 1);
  theEndTimeElement.setAttribute('datetime', theEndDate.getFullYear() + '-12-31');
  theEndTimeElement.innerText = `12/31/${theEndDate.getFullYear()}`;
}

/**
 * 
 */
ContributionsByState.prototype.handleMapSelect = function(state, district) {
  console.log('TODO handleMapSelect(state, district):', state, district);
}

/**
 * Called when the typeahead element dispatches "typeahead:select"
 * @param {jQuery.Event} e - 'typeahead:select' event
 */
ContributionsByState.prototype.handleTypeaheadSelect = function(e, abbreviatedCandidateDetails) {
  console.log('handleTypeaheadSelect() e, abbreviatedCandidateDetails:', e, abbreviatedCandidateDetails);
  // this.candidateDetails = abbreviatedCandidateDetails;
  this.baseStatesQuery.candidate_id = abbreviatedCandidateDetails.id;
  this.loadCandidateDetails(abbreviatedCandidateDetails.id);
}

/**
 * Called on the election year control's change event
 * @param {Event} e
 */
ContributionsByState.prototype.handleElectionYearChange = function(e) {
  console.log('handleElectionYearChange()');
  console.log('this.yearControl.value: ', this.yearControl.value);
  e.preventDefault();
  if (this.validateCandidateVsElectionYear() === true) {
    this.baseStatesQuery.cycle = this.yearControl.value;
    this.loadStatesData();
  }
}

/**
 * 
 */
ContributionsByState.prototype.handleResize = function(e = null) {
  if (e) e.preventDefault();

  let newWidth = this.element.offsetWidth;

  if (newWidth < breakpointToSmall) {
    // It's XS
    this.element.classList.remove('w-s');
    this.element.classList.remove('w-m');
    this.element.classList.remove('w-l');
    this.element.classList.remove('w-xl');
  } else if (newWidth < breakpointToMedium) {
    // It's small
    this.element.classList.add('w-s');
    this.element.classList.remove('w-m');
    this.element.classList.remove('w-l');
    this.element.classList.remove('w-xl');
  } else if (newWidth < breakpointToLarge) {
    // It's medium
    this.element.classList.remove('w-s');
    this.element.classList.add('w-m');
    this.element.classList.remove('w-l');
    this.element.classList.remove('w-xl');
  } else if (newWidth < breakpointToXL) {
    // It's large
    this.element.classList.remove('w-s');
    this.element.classList.remove('w-m');
    this.element.classList.add('w-l');
    this.element.classList.remove('w-xl');
  } else {
    // It's XL
    this.element.classList.remove('w-s');
    this.element.classList.remove('w-m');
    this.element.classList.remove('w-l');
    this.element.classList.add('w-xl');
  }
};

/**
 * 
 * @returns {Boolean} Whether the selected year is in the list of cycles for the selected candidate
 */
ContributionsByState.prototype.validateCandidateVsElectionYear = function() {

  let theErrorBlock = document.querySelector('#gov-fec-contribs-by-state .js-error-message');
  let errorTitle = 'No results';
  let errorMessage = `There is no ${this.yearControl.value} financial data for this candidate. Try searching a different election year.`;

  if (!this.data_states) errorMessage = '';
  else if (this.candidateDetails.election_years && this.yearControl.value) {
    for (var i = 0; i < this.candidateDetails.election_years.length; i++) {
      if (this.candidateDetails.election_years[i] == this.yearControl.value) {
        errorMessage = '';
        break;
      }
    }
  }
  
  theErrorBlock.querySelector('h2').innerText = errorTitle;
  theErrorBlock.querySelector('p').innerText = errorMessage;

  if (errorMessage == '') {
    theErrorBlock.classList.remove('has-error');
    theErrorBlock.setAttribute('aria-hidden', 'true');
    return true;

  } else {
    theErrorBlock.classList.add('has-error');
    theErrorBlock.setAttribute('aria-hidden', 'false');
    return false;
  }
}

/**
 * 
 * @param {Boolean} newState
 */
ContributionsByState.prototype.setLoadingState = function(newState) {
  console.log('setLoadingState(' + newState + ')');
  if (newState === false) this.element.classList.remove('is-loading');
  else if (newState === true) this.element.classList.add('is-loading');
}

new ContributionsByState();