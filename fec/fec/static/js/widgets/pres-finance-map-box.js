'use strict';

/* global CustomEvent */

/**
 * @fileoverview Controls all functionality inside the Where Contributions Come From widget
 * in cooperation with data-map
 * @copyright 2019 Federal Election Commission
 * @license CC0-1.0
 * @owner  fec.gov
 * @version 1.0
 * TODO: For v2 or whatever, convert to datatable.net (start with the simpliest implementation; no columns.js, etc.)
 */

// Editable vars
const stylesheetPath = '/static/css/widgets/pres-finance-map.css';
// // const breakpointToXS = 0; // retaining just in case
const breakpointToSmall = 430;
const breakpointToMedium = 675;
const breakpointToLarge = 700;
const breakpointToXL = 860;
const availElectionYears = [2020, 2016]; // defaults to [0]
const specialCandidateIDs = ['P00000001', 'P00000002', 'P00000003'];
// const rootPathToIndividualContributions =
//   '/data/receipts/individual-contributions/';

import { buildUrl } from '../modules/helpers';
// import { defaultElectionYear } from './widget-vars';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

const DataMap = require('../modules/data-map').DataMap;
const AbortController = window.AbortController;

// Custom event names
const EVENT_APP_ID = 'gov.fec.presFinMap';
const YEAR_CHANGE_EVENT = EVENT_APP_ID + '_yearChange';
const ENTER_LOADING_EVENT = EVENT_APP_ID + '_loading';
const FINISH_LOADING_EVENT = EVENT_APP_ID + '_loaded';
const CHANGE_CANDIDATES_DATA = EVENT_APP_ID + '_candidates_change';
const CHANGE_CANDIDATE = EVENT_APP_ID + '_candidate_change';

/**
 * Formats the given value and puts it into the dom element.
 * @param {Number} passedValue The number to format and plug into the element
 * @param {Boolean} roundToWhole Should we round the cents or no?
 * @returns {String} A string of the given value formatted with a dollar sign, commas, and (if roundToWhole === false) decimal
 */
function formatAsCurrency(passedValue, abbreviateMillions) {
  let toReturn = passedValue;
  if (abbreviateMillions) toReturn = (passedValue / 1000000).toFixed(1);
  else toReturn = Math.round(passedValue.round);
  return '$' + toReturn.toLocaleString();
}

/**
 * Builds the link/url to a filtered Individual Contributions page/list
 * @param {Number} cycle The candidate's election year
 * @param {String} office 'H', 'P', or 'S'
 * @param {Array} committeeIDs An array of strings of the candidate's committees
 * @param {String} stateID Optional. A null value will not filter for any state but show entries for the entire country
 * @returns {String} URL or empty string depending on
 */
function buildIndividualContributionsUrl(
  cycle,
  office,
  committeeIDs,
  stateID,
  candidateState
) {
  // If we're missing required params, just return '' and be done
  // if (!cycle || !office || !committeeIDs) return '';
  // let transactionPeriodsString = 'two_year_transaction_period=' + cycle;
  // // TODO: Do we need maxDate and minDate?
  // // let maxDate = `12-13-${this.baseStatesQuery.cycle}`;
  // // let minDate = `01-01-${this.baseStatesQuery.cycle - 1}`;
  // let committeesString = '';
  // // The API currently wants a two_year_transaction_period value for each set of two years
  // // so we'll add the previous two-year period for presidential races
  // //
  // // Also, Puerto Rico's House elections are for four years so we'll need to
  // // add the previous two-year period to the query string for House candidates from Puerto Rico
  // if (office == 'P' || (office == 'H' && candidateState == 'PR')) {
  //   transactionPeriodsString += '&two_year_transaction_period=' + (cycle - 2);
  //   // and the two earlier two-year periods for Senate races
  // } else if (office == 'S') {
  //   transactionPeriodsString += '&two_year_transaction_period=' + (cycle - 2);
  //   transactionPeriodsString += '&two_year_transaction_period=' + (cycle - 4);
  // }
  // for (let i = 0; i < committeeIDs.length; i++) {
  //   committeesString += '&committee_id=' + committeeIDs[i];
  // }
  // let stateString = stateID ? '&contributor_state=' + stateID : '';
  // let toReturn =
  //   rootPathToIndividualContributions +
  //   '?' +
  //   transactionPeriodsString +
  //   stateString +
  //   committeesString;
  // // TODO: Do we need maxDate and minDate?
  // // `&min_date=${minDate}&max_date=${maxDate}` +
  // return toReturn;
}

/**
 * @constructor
 */
function PresidentialFundsMap() {
  // Get ready to abort a fetch if we need to
  this.fetchAbortController = new AbortController();
  this.fetchAbortSignal = this.fetchAbortController.signal;

  // // Where to find individual candidate details
  this.basePath_candidatesPath = [
    'presidential',
    'contributions',
    'by_candidate'
  ];

  // // Where to find individual candidate details
  // this.basePath_candidateCommitteesPath = [
  //   'candidate',
  //   '000', // candidate ID
  //   'committees',
  //   'history',
  //   2020 // election year / cycle
  // ];
  // // Where to find candidate's coverage dates
  // this.basePath_candidateCoverageDatesPath = [
  //   'candidate',
  //   '000', //candidate ID
  //   'totals'
  // ];
  // // Where to find the highest-earning candidates:
  // this.basePath_highestRaising = ['candidates', 'totals'];
  // // Where to find the list of states:
  // this.basePath_states = [
  //   'schedules',
  //   'schedule_a',
  //   'by_state',
  //   'by_candidate'
  // ];
  // // Where to find the states list grand total:
  // this.basePath_statesTotal = [
  //   'schedules',
  //   'schedule_a',
  //   'by_state',
  //   'by_candidate',
  //   'totals'
  // ];
  this.data_candidates;
  // // Details about the candidate. Comes from the typeahead
  // this.candidateDetails = {};
  // // Information retruned by API candidate committees API {@see loadCandidateCommitteeDetails}
  // this.data_candidateCommittees = {};
  // // Init the list/table of states and their totals
  // this.data_states = {
  //   results: [
  //     {
  //       candidate_id: '',
  //       count: 0,
  //       cycle: 2020,
  //       state: '',
  //       state_full: '',
  //       total: 0
  //     }
  //   ]
  // };
  // // Shared settings for every fetch():
  this.fetchInitObj = {
    cache: 'no-cache',
    mode: 'cors',
    signal: null
  };
  // this.fetchingStates = false; // Are we waiting for data?
  this.element = document.querySelector('#gov-fec-pres-finance'); // The visual element associated with this, this.instance
  // this.candidateDetailsHolder; // Element to hold candidate name, party, office, and ID
  this.current_electionYear = availElectionYears[0];
  this.current_electionState = 'US';
  this.current_candidate_id = '';
  // this.map; // Starts as the element for the map but then becomes a DataMap object
  // this.table; // The <table> for the list of states and their totals
  // this.statesTotalHolder; // Element at the bottom of the states list
  // this.typeahead; // The typeahead candidate element:
  // this.typeahead_revertValue; // Temporary var saved while user is typing
  // this.yearControl; // The <select> for election years:
  // this.buttonIndivContribs;
  // // this.buttonMethodology;
  // this.remoteTableHeader;
  // this.remoteTable;

  // // Populate the examples text because handlebars doesn't like to add the italics/emphasis
  // document.querySelector(
  //   '#gov-fec-contribs-by-state .typeahead-filter .filter__instructions'
  // ).innerHTML = 'Examples: <em>Bush, George W</em> or <em>P00003335</em>';

  // // Move the typeahead message into the typeahead object so its content lines up properly
  // document
  //   .querySelector('#contribs-by-state-cand-field')
  //   .appendChild(document.querySelector('#contribs-by-state-typeahead-error'));

  // // If we have the element on the page, fire it up
  if (this.element) this.init();
}

/**
 * Called after construction.
 * Identifies and initializes the various visual elements and controls, queries, and starts first data load
 */
PresidentialFundsMap.prototype.init = function() {
  // // Add the stylesheet to the document <head>
  // let head = document.head;
  // let linkElement = document.createElement('link');
  // linkElement.type = 'text/css';
  // linkElement.rel = 'stylesheet';
  // linkElement.href = stylesheetPath;
  // head.appendChild(linkElement);

  // // Init the election year selector (The element ID is set in data/templates/partials/widgets/contributions-by-state.jinja)
  // // TODO: Can we remove the default listener (like with the typeahead above) and not change the URL when the <select> changes?
  this.yearControl = this.element.querySelector('#filter-year');
  let theFieldset = this.yearControl.querySelector('fieldset');
  for (let i = 0; i < availElectionYears.length; i++) {
    let thisYear = availElectionYears[i];
    let newElem = document.createElement('label');
    let switched = i == 0 ? ' checked' : '';
    newElem.setAttribute('class', `toggle`);
    newElem.setAttribute('for', `switcher-${thisYear}`);
    newElem.innerHTML = `<input type="radio" class="toggle" value="${thisYear}" id="switcher-${thisYear}" name="year_selector-TODO" data-prefix="TODO:" data-tag-value="${thisYear}" aria-controls="${thisYear}-message" tabindex="0"${switched}><span class="button--alt">${thisYear}</span>`;
    theFieldset.appendChild(newElem);
  }
  this.yearControl.addEventListener(
    'change',
    this.handleElectionYearChange.bind(this)
  );

  this.element.addEventListener(
    PresidentialFundsMap.YEAR_CHANGE_EVENT,
    this.handleYearChange.bind(this)
  );
  // // Initialize the various queries
  // this.baseCandidateQuery = {}; // Calls for candidate details
  this.baseCandidatesQuery = {
    // cycle: defaultElectionYear(),
    // election_full: true,
    // office: 'P',
    // page: 1,
    // per_page: 200,
    // sort_hide_null: false,
    // sort_null_only: false,
    // sort_nulls_last: false
    // candidate_id: '', // 'P60007168',
    // is_active_candidate: true,
    // sort: 'total'
  };

  // // Find the visual elements
  // this.map = document.querySelector('.map-wrapper .election-map');
  // this.candidateDetailsHolder = document.querySelector('.candidate-details');
  this.table = document.querySelector('#pres-fin-map-candidates-table');
  // this.statesTotalHolder = document.querySelector('.js-states-total');

  // // Fire up the map
  // this.map = new DataMap(this.map, {
  //   color: '#36BDBB',
  //   data: '',
  //   addLegend: true,
  //   addTooltips: true
  // });

  // // Listen for the Browse Individual Contributions button to be clicked
  // this.buttonIndivContribs = this.element.querySelector(
  //   '.js-browse-indiv-contribs-by-state'
  // );
  // this.buttonIndivContribs.addEventListener(
  //   'click',
  //   this.updateBrowseIndivContribsButton.bind(this)
  // );

  // Internet Explorer doesn't like flex display
  // so we're going to keep the states table from switching to flex.
  let userAgent = window.navigator.userAgent;
  // Test for IE and IE 11
  let is_ie =
    userAgent.indexOf('MSIE ') > 0 || userAgent.indexOf('Trident/7.0') > 0;

  // // Initialize the remote table header
  // // Find the remote header and save it
  // this.remoteTableHeader = this.element.querySelector(
  //   '.js-remote-table-header'
  // );
  // // Save its <thead> for a few lines
  // let theRemoteTableHead = this.remoteTableHeader.querySelector('thead');
  // // Look at the data-for attribute of remoteTableHeader and save that element
  // this.remoteTable = this.element.querySelector(
  //   '#' + this.remoteTableHeader.getAttribute('data-for')
  // );
  // // Remember the <thead> in remoteTable for few lines
  // let theRemotedTableHead = this.remoteTable.querySelector('thead');
  // // If we have both <thead> elements, we're ready to manipulate them
  // if (theRemoteTableHead && theRemotedTableHead) {
  //   this.remoteTableHeader.style.display = 'table';
  //   theRemotedTableHead.style.display = 'none';
  // }

  if (is_ie) {
    this.remoteTable.classList.add('table-display');
    this.remoteTableHeader.classList.add('table-display');
  }

  this.element.addEventListener(
    CHANGE_CANDIDATES_DATA,
    this.handleCandidatesDataLoad.bind(this)
  );
  this.element.addEventListener(
    CHANGE_CANDIDATE,
    this.handleCandidateChange.bind(this)
  );

  // Listen for resize events
  window.addEventListener('resize', this.handleResize.bind(this));
  // Call for a resize on init
  this.handleResize();

  // And start the first load
  this.loadCandidatesList();
};

/**
 * Called by {@see init() , @see handleTypeaheadSelect() }
 * Finds the highest-earning presidential candidate of the default year
 * Similar to {@see loadCandidateDetails() }
 */
PresidentialFundsMap.prototype.loadCandidatesList = function() {
  let newEvent = new CustomEvent(PresidentialFundsMap.ENTER_LOADING_EVENT);
  document.dispatchEvent(newEvent);

  // sort_hide_null=false
  // &page=1
  // &sort_nulls_last=false
  // &sort_null_only=false
  // &election_year=2020
  // &per_page=20

  let instance = this;
  let candidatesListQuery = Object.assign({}, this.baseCandidatesQuery, {
    sort: '-net_receipts',
    per_page: 100,
    election_year: this.current_electionYear,
    contributor_state: this.current_electionState
    // sort_hide_null: false
  });
  window
    .fetch(
      buildUrl(this.basePath_candidatesPath, candidatesListQuery),
      this.fetchInitObj
    )
    .then(function(response) {
      if (response.status !== 200)
        throw new Error('The network rejected the candidate raising request.');
      // else if (response.type == 'cors') throw new Error('CORS error');
      response.json().then(data => {
        // Save the candidate query reply
        // and the candidate details specifically
        // instance.candidateDetails = data.results[0];
        // Update the candidate_id for the main query
        // instance.baseStatesQuery.candidate_id =
        //   instance.candidateDetails.candidate_id;
        // Update the office to the main query, too.
        // instance.baseStatesQuery.office = instance.candidateDetails.office;
        // Put the new candidate information on the page
        instance.element.dispatchEvent(
          new CustomEvent(CHANGE_CANDIDATES_DATA, { detail: data })
        );
        // instance.displayUpdatedData_candidate();
      });
    })
    .catch(function() {});
};

/**
 * TODO -
 */
PresidentialFundsMap.prototype.handleCandidatesDataLoad = function(e) {
  this.data_candidates = e.detail;
  this.displayUpdatedData_candidates(this.data_candidates.results);
};

/**
 * Retrieves full candidate details when the typeahead is used
 * Called from {@see handleTypeaheadSelect() }
 * Similar to {@see loadCandidatesList() }
 * @param {String} cand_id Comes from the typeahead
 */
PresidentialFundsMap.prototype.loadCandidateDetails = function(cand_id) {
  // let instance = this;
  // this.basePath_candidatePath[1] = cand_id;
  // window
  //   .fetch(
  //     buildUrl(this.basePath_candidatePath, this.baseCandidateQuery),
  //     this.fetchInitObj
  //   )
  //   .then(function(response) {
  //     if (response.status !== 200)
  //       throw new Error('The network rejected the candidate details request.');
  //     // else if (response.type == 'cors') throw new Error('CORS error');
  //     response.json().then(data => {
  //       // Save the candidate query response
  //       instance.data_candidate = data;
  //       // Save the candidate details
  //       instance.candidateDetails = data.results[0];
  //       // Update the base query with the new candidate ID
  //       instance.baseStatesQuery.candidate_id =
  //         instance.candidateDetails.candidate_id;
  //       // Save the office to the base query, too
  //       instance.baseStatesQuery.office = instance.candidateDetails.office;
  //       // Then put the new candidate details into the page
  //       instance.displayUpdatedData_candidate();
  //     });
  //   })
  //   .catch(function() {});
};

/**
 * Queries the API for the candidate's coverage dates for the currently-selected election
 * Called by {@see displayUpdatedData_candidate() } and {@see displayUpdatedData_candidates() }
 */
PresidentialFundsMap.prototype.loadCandidateCoverageDates = function() {
  // let instance = this;
  // this.basePath_candidateCoverageDatesPath[1] = this.candidateDetails.candidate_id;
  // let coverageDatesQuery = Object.assign(
  //   {},
  //   {
  //     per_page: 100,
  //     cycle: this.baseStatesQuery.cycle,
  //     election_full: true
  //   }
  // );
  // /**
  //  * Format the dates into MM/DD/YYYY format.
  //  * Pads single digits with leading 0.
  //  */
  // var formatDate = function(date) {
  //   // Adds one since js month uses zero based index
  //   let month = date.getMonth() + 1;
  //   if (month < 10) {
  //     month = '0' + month;
  //   }
  //   let day = date.getDate();
  //   if (day < 10) {
  //     day = '0' + day;
  //   }
  //   return month + '/' + day + '/' + date.getFullYear();
  // };
  // let theFetchUrl = buildUrl(
  //   instance.basePath_candidateCoverageDatesPath,
  //   coverageDatesQuery
  // );
  // window
  //   .fetch(theFetchUrl, instance.fetchInitObj)
  //   .then(function(response) {
  //     if (response.status !== 200)
  //       throw new Error('The network rejected the coverage dates request.');
  //     // else if (response.type == 'cors') throw new Error('CORS error');
  //     response.json().then(data => {
  //       if (data.results.length === 1) {
  //         document
  //           .querySelector('.states-table-timestamp')
  //           .removeAttribute('style');
  //         // Parse coverage date from API that is formatted like this: 2019-06-30T00:00:00+00:00
  //         // into a string without timezone
  //         let coverage_start_date = new Date(
  //           data.results[0].coverage_start_date.substring(0, 19)
  //         );
  //         let coverage_end_date = new Date(
  //           data.results[0].transaction_coverage_date.substring(0, 19)
  //         );
  //         // Remember the in-page elements
  //         let theStartTimeElement = document.querySelector(
  //           '.js-cycle-start-time'
  //         );
  //         let theEndTimeElement = document.querySelector('.js-cycle-end-time');
  //         // Format the date and put it into the start time
  //         theStartTimeElement.innerText = formatDate(coverage_start_date);
  //         // Format the date and put it into the end time
  //         theEndTimeElement.innerText = formatDate(coverage_end_date);
  //       } else {
  //         // Hide coverage dates display when there are zero results
  //         document
  //           .querySelector('.states-table-timestamp')
  //           .setAttribute('style', 'opacity: 0;');
  //       }
  //     });
  //   })
  //   .catch(function() {});
};

/**
 * Asks the API for the details of the candidate's committees for the currently-selected election
 * Called by {@see displayUpdatedData_candidate() }
 */
PresidentialFundsMap.prototype.loadCandidateCommitteeDetails = function() {
  // let instance = this;
  // // Before we fetch, make sure the query path has the current candidate id
  // this.basePath_candidateCommitteesPath[1] = this.candidateDetails.candidate_id;
  // // and the current election year/cycle
  // this.basePath_candidateCommitteesPath[4] = this.baseStatesQuery.cycle;
  // let committeesQuery = Object.assign(
  //   {},
  //   {
  //     per_page: 100,
  //     election_full: true
  //   }
  // );
  // let theFetchUrl = buildUrl(
  //   instance.basePath_candidateCommitteesPath,
  //   committeesQuery
  // );
  // // because the API wants two `designation` values, and that's a violation of key:value law,
  // // we'll add them ourselves:
  // theFetchUrl += '&designation=P&designation=A';
  // window
  //   .fetch(theFetchUrl, instance.fetchInitObj)
  //   .then(function(response) {
  //     if (response.status !== 200)
  //       throw new Error(
  //         'The network rejected the candidate committee details request.'
  //       );
  //     // else if (response.type == 'cors') throw new Error('CORS error');
  //     response.json().then(data => {
  //       // Save the candidate committees query response for when we build links later
  //       instance.data_candidateCommittees = data;
  //       // Now that we have the committee info, load the new states data
  //       instance.loadStatesData();
  //     });
  //   })
  //   .catch(function() {
  //     // TODO: handle catch. Maybe we remove the links if the committee data didn't load?
  //   });
};

/**
 * Starts the fetch to go get the big batch of states data, called by {@see init() }
 */
PresidentialFundsMap.prototype.loadStatesData = function() {
  // let instance = this;
  // let baseStatesQueryWithCandidate = Object.assign({}, this.baseStatesQuery, {
  //   candidate_id: this.candidateDetails.candidate_id
  // });
  // // Let's stop any currently-running states fetches
  // if (this.fetchingStates) this.fetchAbortController.abort();
  // // Start loading the states data
  // this.fetchingStates = true;
  // this.setLoadingState(true);
  // window
  //   .fetch(
  //     buildUrl(this.basePath_states, baseStatesQueryWithCandidate),
  //     this.fetchInitObj
  //   )
  //   .then(function(response) {
  //     instance.fetchingStates = false;
  //     if (response.status !== 200)
  //       throw new Error('The network rejected the states request.');
  //     // else if (response.type == 'cors') throw new Error('CORS error');
  //     response.json().then(data => {
  //       // Now that we have all of the values, let's sort them by total, descending
  //       data.results.sort((a, b) => {
  //         return b.total - a.total;
  //       });
  //       // After they're sorted, let's hang on to them
  //       instance.data_states = data;
  //       instance.displayUpdatedData_candidates();
  //     });
  //   })
  //   .catch(function() {
  //     instance.fetchingStates = false;
  //   });
  // // Start loading the states total
  // window
  //   .fetch(
  //     buildUrl(this.basePath_statesTotal, baseStatesQueryWithCandidate),
  //     this.fetchInitObj
  //   )
  //   .then(function(response) {
  //     if (response.status !== 200)
  //       throw new Error('The network rejected the states total request.');
  //     // else if (response.type == 'cors') throw new Error('CORS error');
  //     response.json().then(data => {
  //       instance.displayUpdatedData_total(data);
  //     });
  //   })
  //   .catch(function() {});
  // logUsage(this.baseStatesQuery.candidate_id, this.baseStatesQuery.cycle);
};

/**
 * Puts the candidate details in the page,
 * then loads the states data with {@see loadStatesData() }
 */
PresidentialFundsMap.prototype.displayUpdatedData_candidate = function() {
  // If this is the first load, the typeahead won't have a value; let's set it
  // let theTypeahead = document.querySelector('#contribs-by-state-cand');
  // if (!theTypeahead.value) theTypeahead.value = this.candidateDetails.name;
  // // …their desired office during this election…
  // let candidateOfficeHolder = this.candidateDetailsHolder.querySelector('h2');
  // let theOfficeName = this.candidateDetails.office_full;
  // candidateOfficeHolder.innerText = `Candidate for ${
  //   theOfficeName == 'President' ? theOfficeName.toLowerCase() : theOfficeName
  // }`;
  // // …and their candidate ID for this office
  // let candidateIdHolder = this.candidateDetailsHolder.querySelector('h3');
  // candidateIdHolder.innerText = 'ID: ' + this.candidateDetails.candidate_id;
  // // Update the <select>
  // // TODO: handle if there are no years
  // // TODO: handle if there is only one year (hide select? disable it? Not awful if it's exactly one option)
  // // Grab election_years from the candidate details
  // let candidateElectionYears = this.candidateDetails.election_years;
  // let evenElectionYears = candidateElectionYears.map(electionYear => {
  //   if (electionYear % 2 === 0) {
  //     return electionYear;
  //   } else {
  //     electionYear = electionYear + 1;
  //     return electionYear;
  //   }
  // });
  // // Take the new even election years set and make it distinct
  // // eslint-disable-next-line no-undef
  // let validElectionYears = [...new Set(evenElectionYears)];
  // // Sort them so the most recent is first so it'll be on top of the <select>
  // validElectionYears.sort((a, b) => b - a);
  // // Remember what year's election we're currently showing (will help if we were switching between candidates of the same year)
  // let previousElectionYear = this.yearControl.value;
  // // Otherwise we'll show the most recent election of these options
  // let nextElectionYear = validElectionYears[0];
  // // validElectionYears.includes(previousElectionYear) wasn't working so let's go through the validElectionYears
  // // and stick with previousElectionYear if it's a valid year for this candidate
  // for (let i = 0; i < validElectionYears.length; i++) {
  //   if (previousElectionYear == validElectionYears[i]) {
  //     nextElectionYear = previousElectionYear;
  //     break;
  //   }
  // }
  // // Build the <option><option> list
  // let newSelectOptions = '';
  // for (let i = 0; i < validElectionYears.length; i++) {
  //   newSelectOptions += `<option value="${validElectionYears[i]}"${
  //     nextElectionYear == validElectionYears[i] ? ' selected' : ''
  //   }>${validElectionYears[i]}</option>`;
  // }
  // // Put the new options into the <select>
  // this.yearControl.innerHTML = newSelectOptions;
  // // If the previous election and this one are different,
  // // save the new election year to the base query
  // if (previousElectionYear != nextElectionYear)
  //   this.baseStatesQuery.cycle = nextElectionYear;
  // // Update candidate name and link
  // this.setCandidateName(
  //   this.candidateDetails.candidate_id,
  //   this.candidateDetails.name,
  //   this.candidateDetails.party,
  //   this.baseStatesQuery.cycle
  // );
  // this.loadCandidateCoverageDates();
  // // Now that we have the candidate's personal details,
  // // we need to get the committee data
  // this.loadCandidateCommitteeDetails();
};

/**
 * Put the list of states and totals into the table
 * Called by {@see loadStatesData() }
 * TODO: This will eventually be replaced by the datatables functionality
 */
PresidentialFundsMap.prototype.displayUpdatedData_candidates = function(
  results
) {
  console.log('displayUpdatedData_candidates(): ', results);
  let theTableBody = this.table.querySelector('tbody');
  theTableBody.innerHTML = '';
  // let theTbodyString = '';
  if (results.length === 0) {
    // If there are no results to show
    this.handleErrorState('NO_RESULTS_TO_DISPLAY');
  } else {
    // If there ARE results to show
    // We're going to need the committee IDs for the totals link
    // let theCommitteeIDs = [];
    // for (let i = 0; i < this.data_candidateCommittees.results.length; i++) {
    //   theCommitteeIDs.push(
    //     this.data_candidateCommittees.results[i].committee_id
    //   );
    // }
    for (let i = 0; i < results.length; i++) {
      // let theStateTotalUrl = buildIndividualContributionsUrl(
      //   this.baseStatesQuery.cycle,
      //   this.baseStatesQuery.office,
      //   theCommitteeIDs,
      //   results[i].state,
      //   this.candidateDetails.state
      // );
      // Candidate name cell
      let theNewRow = document.createElement('tr');
      theNewRow.setAttribute('data-candidate_id', results[i].candidate_id);
      let newRowContent = '';
      newRowContent += `<td>${results[i].candidate_last_name}`;
      if (!specialCandidateIDs.includes(results[i].candidate_id)) {
        newRowContent += ` [${results[i].candidate_party_affiliation}]`;
      }
      newRowContent += `</td>`;
      // Total raised cell
      newRowContent += '<td class="t-right-aligned t-mono">';
      newRowContent += formatAsCurrency(
        results[i].net_receipts,
        this.current_electionState == 'US'
      );
      newRowContent += '</td>';
      theNewRow.innerHTML = newRowContent;
      theTableBody.appendChild(theNewRow);
      theNewRow.addEventListener(
        'click',
        this.handleCandidateListClick.bind(this)
      );
    }
    // theTableBody.innerHTML = theTbodyString;
  }
  // Update candidate's coverage dates above the states list
  // this.loadCandidateCoverageDates();
  // Update the Individual Contributions button/link at the bottom
  // this.updateBrowseIndivContribsButton();
  // Let the map know that the data has been updated
  // this.map.handleDataRefresh(theData);
  // Clear the classes and reset functionality so the tool is usable again
  // this.setLoadingState(false);
};

/**
 * Puts the states grand total into the total field at the bottom of the table
 * Called by its fetch inside {@see loadStatesData() }
 * @param {Object} data The results from the fetch
 */
PresidentialFundsMap.prototype.displayUpdatedData_total = function(data) {
  // Set the states total dollars to the number we received, or empty it if there are no results
  // this.statesTotalHolder.innerText =
  //   data.results.length > 0
  //     ? (this.statesTotalHolder.innerText = formatAsCurrency(
  //         data.results[0].total
  //       ))
  //     : '';
  // let statesHolder = this.element.querySelector('.states-total');
  // if (data.results.length > 0) statesHolder.setAttribute('style', '');
  // else statesHolder.setAttribute('style', 'opacity: 0;');
};

/**
 *
 */
PresidentialFundsMap.prototype.updateBreadcrumbs = function() {
  console.log('updateBreadcrumbs()');
  let theHolder = this.element.querySelector('.breadcrumb-nav');
  let theSeparator = theHolder.querySelector('span');
  let theSecondItem = theHolder.querySelectorAll('a')[1];
  let theSecondLabel = '';

  if (
    this.current_candidate_id == specialCandidateIDs[0] &&
    this.current_electionState == 'US'
  ) {
    // If we're showing the US map and 'All' candidates,
    // TODO - done, let's hide the span and the second element
  } else if (this.current_electionState == 'US') {
    // Or if we're showing the US map and not-'All' candidates
    theSecondLabel = 'Nationwide: ';
  } else {
    // Otherwise, we're showing a state so we need a state lookup
    // TODO: theSecondLabel = (lookup the state name for this.current_electionState)
    theSecondLabel = 'State: ';
  }

  if (theSecondLabel != '') {
    if (specialCandidateIDs.includes(this.current_candidate_id)) {
      // If we're looking at a special candidate (Dems, Reps ('all' is hidden from above))
      // TODO: theSecondLabel += this.candidate_last_name?
      theSecondLabel += 'party name here';
    } else {
      // We're dealing with a real candidate so we need to get the name from somewhere else
      // TODO: theSecondLabel += this.find the last name
      theSecondLabel += 'candidate name here';
    }
  }
  theSecondItem.style.display = theSecondLabel != '' ? 'block' : 'none';
  theSeparator.style.display = theSecondLabel != '' ? 'block' : 'none';
  theSecondItem.innerHTML = theSecondLabel;
};

/**
 *
 */
PresidentialFundsMap.prototype.handleYearChange = function(e) {
  console.log('handleYearChange(): ', e);
  this.current_electionYear = e.detail;
  this.loadCandidatesList();
};

/**
 *
 */
PresidentialFundsMap.prototype.handleCandidateListClick = function(e) {
  console.log('handleCandidateListClick(): ', e);
  let newCandidateId = e.target.dataset.candidate_id;
  if (newCandidateId != this.current_candidate_id) {
    this.current_candidate_id = newCandidateId;
    this.element.dispatchEvent(
      new CustomEvent(CHANGE_CANDIDATE, { detail: newCandidateId })
    );
  }
};

PresidentialFundsMap.prototype.handleCandidateChange = function(e) {
  console.log('handleCandidateChange(): ', e);
  this.updateBreadcrumbs();
  // TODO: this should trigger the map to load change to the candidate's data (or, 'US')
};

// Set the candidate's name and link change
PresidentialFundsMap.prototype.setCandidateName = function(
  id,
  candidateName,
  party,
  cycle
) {
  // let candidateNameElement = this.candidateDetailsHolder.querySelector('h1');
  // candidateNameElement.innerHTML = `<a href="/data/candidate/${id}/?cycle=${cycle}&election_full=true">${candidateName}</a> [${party}]`;
};

/**
 * Called on the election year control's change event
 * Starts loading the new data
 * @param {Event} e
 */
PresidentialFundsMap.prototype.handleElectionYearChange = function(e) {
  console.log('handleElectionYearChange() e: ', e);
  // this.baseStatesQuery.cycle = this.yearControl.value;
  // // Update candidate name and link
  // this.setCandidateName(
  //   this.candidateDetails.candidate_id,
  //   this.candidateDetails.name,
  //   this.candidateDetails.party,
  //   this.baseStatesQuery.cycle
  // );
  let yearChangeEvent = new CustomEvent(
    PresidentialFundsMap.YEAR_CHANGE_EVENT,
    { detail: e.target.value }
  );
  this.element.dispatchEvent(yearChangeEvent);

  // // We don't need to load the candidate details for a year change,
  // // so we'll just jump right to loading the committees data for the newly-chosen year.
  // this.loadCandidateCommitteeDetails();
};

/**
 * Called from throughout the widget
 * @param {String} errorCode
 */
PresidentialFundsMap.prototype.handleErrorState = function(errorCode) {
  // if (errorCode == 'NO_RESULTS_TO_DISPLAY') {
  //   // Empty the states list and update the date range
  //   let theStatesTableBody = this.table.querySelector('tbody');
  //   let theDateRange = this.baseStatesQuery.cycle;
  //   if (this.baseStatesQuery.office == 'P')
  //     theDateRange = theDateRange - 3 + '-' + theDateRange;
  //   else if (this.baseStatesQuery.office == 'S')
  //     theDateRange = theDateRange - 5 + '-' + theDateRange;
  //   else theDateRange = theDateRange - 1 + '-' + theDateRange;
  //   let theErrorMessageHTML = `<tr><td colspan="3" class="error-msg">We don&apos;t have itemized individual contributions for this candidate for ${theDateRange}.</td></tr>`;
  //   theStatesTableBody.innerHTML = theErrorMessageHTML;
  // }
};

/**
 * Updates the href of the Individual Contributions link/button at the bottom of the widget
 */
PresidentialFundsMap.prototype.updateBrowseIndivContribsButton = function() {
  // We need to go through the committee results and build an array of the committee IDs
  // to send to {@see buildIndividualContributionsUrl() }
  // let theCommittees = this.data_candidateCommittees.results;
  // let theCommitteeIDs = [];
  // for (let i = 0; i < theCommittees.length; i++) {
  //   theCommitteeIDs.push(theCommittees[i].committee_id);
  // }
  // let theButton = this.element.querySelector(
  //   '.js-browse-indiv-contribs-by-state'
  // );
  // theButton.setAttribute(
  //   'href',
  //   buildIndividualContributionsUrl(
  //     this.baseStatesQuery.cycle,
  //     this.baseStatesQuery.office,
  //     theCommitteeIDs
  //   )
  // );
};

/**
 * Listens to window resize events and adjusts the classes for the <aside> based on its width
 * (rather than the page's width, which is problematic when trying to determine whether there's a side nav)
 */
PresidentialFundsMap.prototype.handleResize = function(e = null) {
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

  setTimeout(this.refreshOverlay.bind(this), 250);
};

/**
 * Called by {@see handleResize() }, to re-position the "loading" overlay
 */
PresidentialFundsMap.prototype.refreshOverlay = function() {
  // let timeStampHeight = 25;
  // let theMap = this.element.querySelector('.map-wrapper');
  // let theOverlay = this.element.querySelector('.overlay__container');
  // let theTopPos =
  //   this.element.querySelector('.state-list-wrapper').offsetTop +
  //   timeStampHeight;
  // let theBottomPos = theMap.offsetTop + theMap.offsetHeight;
  // let theHeight = theBottomPos - theTopPos;
  // theOverlay.style.top = `${theTopPos}px`;
  // theOverlay.style.height = `${theHeight}px`;
};

/**
 * Controls class names and functionality of the widget.
 * Called when we both start and complete (@see loadStatesData() )
 * @param {Boolean} newState
 */
PresidentialFundsMap.prototype.setLoadingState = function(newState) {
  // if (newState === false) {
  //   this.element
  //     .querySelector('.overlay__container')
  //     .classList.remove('is-loading');
  //   this.element.querySelector('.overlay').classList.remove('is-loading');
  //   this.element
  //     .querySelector('#state-contribs-years')
  //     .removeAttribute('disabled');
  // } else if (newState === true) {
  //   this.element
  //     .querySelector('.overlay__container')
  //     .classList.add('is-loading');
  //   this.element.querySelector('.overlay').classList.add('is-loading');
  //   this.element
  //     .querySelector('#state-contribs-years')
  //     .setAttribute('disabled', true);
  //   // trigger resize:
  //   this.handleResize();
  // }
};

/**
 * Handles the usage analytics for this module
 * @TODO: Decide how to gather usage insights while embedded
 * @param {String} candID - The candidate ID
 * @param {*} electionYear - String or Number, the user-selected election year
 */
function logUsage(candID, electionYear) {
  // if (window.ga) {
  //   window.ga('send', 'event', {
  //     eventCategory: 'Widget-PresFinMap',
  //     eventAction: 'interaction',
  //     eventLabel: candID + ',' + electionYear
  //   });
  // }
}

new PresidentialFundsMap();
