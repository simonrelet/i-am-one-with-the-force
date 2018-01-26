import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import changeCase from 'change-case';
import './Search.css';

const Filter = props => {
  const { name, searchIn, onFilterChange } = props;
  return (
    <label className="Filter">
      <input
        name={name}
        type="checkbox"
        checked={searchIn}
        onChange={event => onFilterChange(name, event.target.checked)}
      />
      <span className="Filter-label">{changeCase.sentenceCase(name)}</span>
    </label>
  );
};

const Filters = props => {
  const { resources, onFilterAll, onFilterChange } = props;

  return (
    <div className="Filters content-justified">
      <div className="Filters-header">
        <legend className="Filters-legend">Include:</legend>
        <button className="Filters-include-all" onClick={() => onFilterAll()}>
          Include all
        </button>
      </div>

      <div className="Filters-list">
        {resources.map(resource => (
          <Filter
            key={resource.name}
            {...resource}
            onFilterChange={onFilterChange}
          />
        ))}
      </div>
    </div>
  );
};

class Search extends Component {
  static propTypes = {
    onSearchChange: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onFilterAll: PropTypes.func.isRequired,
    search: PropTypes.string.isRequired,
    resources: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
  };

  state = {
    showFilters: false,
  };

  handleFocus = () => {
    if (this.input) {
      this.input.select();
    }
  };

  handleToggleFilter = event => {
    this.setState(state => ({ showFilters: !state.showFilters }));
  };

  render() {
    const {
      disabled,
      search,
      resources,
      onFilterAll,
      onFilterChange,
    } = this.props;
    const { showFilters } = this.state;

    return (
      <div className="Search">
        <div className="Search-bar content-justified">
          <input
            autoFocus
            aria-label="Search"
            disabled={disabled}
            ref={input => {
              this.input = input;
            }}
            className="Search-input"
            placeholder="Search"
            onChange={event => this.props.onSearchChange(event.target.value)}
            value={search}
            onFocus={this.handleFocus}
          />

          {resources.length > 0 && (
            <button
              className={classNames({
                'Search-more-filters': true,
                'Search-more-filters-open': showFilters,
              })}
              onClick={this.handleToggleFilter}
            >
              More filters
            </button>
          )}
        </div>

        {showFilters && (
          <Filters
            resources={resources}
            onFilterAll={onFilterAll}
            onFilterChange={onFilterChange}
          />
        )}
      </div>
    );
  }
}

export default Search;
