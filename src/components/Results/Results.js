import React from 'react';
import PropTypes from 'prop-types';
import changeCase from 'change-case';
import './Results.css';

const maxResultToShow = 5;

const ResourceItem = props => {
  const { name, caption } = props;
  return (
    <div className="ResourceItem">
      <div className="ResourceItem-title">{name}</div>
      {caption && <div className="ResourceItem-caption">{caption}</div>}
    </div>
  );
};

const getComponentForResource = resourceName => {
  switch (resourceName) {
    case 'films':
      return ({ title }) => <ResourceItem name={title} />;

    case 'starships':
    case 'vehicles':
      return ({ name, model }) => <ResourceItem name={name} caption={model} />;

    default:
      return ({ name }) => <ResourceItem name={name} />;
  }
};

const ResourcesResult = props => {
  const { name, component: ComponentProp, count, results } = props;
  const resultsToShow = results.slice(0, maxResultToShow);

  return (
    <div className="ResourcesResult">
      <h2 className="ResourcesResult-title">
        {name} ({count})
      </h2>
      <div className="ResourcesResult-list">
        {resultsToShow.map(result => (
          <ComponentProp key={result.url} {...result} />
        ))}
      </div>
    </div>
  );
};

const Results = props => {
  const results = props.results.filter(results => results.matches.count > 0);

  if (results.length === 0) {
    return <p className="Message">No result found for your search.</p>;
  }

  return (
    <div className="Results">
      {results.map(result => (
        <div className="Results-item" key={result.resourceName}>
          <ResourcesResult
            {...result.matches}
            name={changeCase.sentenceCase(result.resourceName)}
            component={getComponentForResource(result.resourceName)}
          />
        </div>
      ))}
    </div>
  );
};

Results.propTypes = {
  results: PropTypes.array.isRequired,
};

export default Results;
