import React from 'react';
import logo from './logo.svg';
import './App.css';
import PortfolioOverview from './dashboards/essentiality/portfolio-overview';
import PortfolioBreakdown from './dashboards/essentiality/portfolio-breakdown';
import PatentStatusDistribution from './dashboards/general/patent-status-distribution';
import CoAssignee from './analytics/co-assignee';
import WordCloud from './other/word-cloud';

function App() {
  return (
    <div className="App">
      <div className="row">
      <div className="col-6"><PortfolioOverview /></div>
      <div className="col-6">
      <PortfolioBreakdown />
      </div>
      <div className='row'>
        <div className='col-6'>
          <PatentStatusDistribution />
        </div>
        <div className='col-6'>
          <CoAssignee />
        </div>
      </div>
      <div className='row'>
        <div className='col-6'>
          <WordCloud />
        </div>
        </div>
      </div>
    </div>
  );
}

export default App;
