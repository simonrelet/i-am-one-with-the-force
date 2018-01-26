import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import debounce from 'lodash.debounce';
import queryString from 'query-string';
import Search from '../Search';
import Results from '../Results';
import './App.css';

const apiURL = 'https://swapi.co/api';

const searchInResource = (resource, search) => {
  return fetch(`${resource.url}?search=${search}`)
    .then(result => result.json())
    .then(result => ({
      resourceName: resource.name,
      matches: result,
    }));
};

class App extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  state = {
    search: '',
    resources: [],
    results: [],
    pending: false,
    typing: false,
    serverError: false,
  };

  componentDidMount() {
    this.restoreSearch();

    // The trailing `/` is necessary to avoid beening blocked by CORS policy
    fetch(`${apiURL}/`)
      .then(response => response.json())
      .then(resourcesMap => {
        const resources = Object.keys(resourcesMap).map(resourceName => ({
          name: resourceName,
          url: resourcesMap[resourceName],
          searchIn: true,
        }));

        this.setState({ resources });

        // The search was restored before we got the resources
        if (this.state.search) {
          this.fetchData();
        }
      })
      .catch(this.handleError);
  }

  restoreSearch = () => {
    const { q: search } = queryString.parse(this.props.location.search);
    if (search) {
      this.setState({ search, typing: true });
    }
  };

  handleSearchChange = search => {
    this.setState({ search, typing: true });
    this.fetchData();
  };

  handleFilterChange = (resourceName, searchIn) => {
    this.setState(state => ({
      resources: state.resources.map(
        resource =>
          resource.name === resourceName ? { ...resource, searchIn } : resource,
      ),
    }));

    this.fetchData();
  };

  handleFilterAll = () => {
    this.setState(state => ({
      resources: state.resources.map(resource => ({
        ...resource,
        searchIn: true,
      })),
    }));

    this.fetchData();
  };

  fetchData = debounce(() => {
    this.setState({ typing: false });

    const { search, resources } = this.state;
    const searchTrimed = search.trim();

    const queries = { q: searchTrimed };
    this.props.history.push(`/?${queryString.stringify(queries)}`);

    const resourcesToSearchIn = resources.filter(resource => resource.searchIn);
    if (resourcesToSearchIn.length) {
      if (searchTrimed) {
        this.setState({ pending: true });

        Promise.all(
          resourcesToSearchIn.map(resource =>
            searchInResource(resource, searchTrimed),
          ),
        )
          .then(results => {
            this.setState({ results });
          })
          .catch(this.handleError)
          .then(() => {
            this.setState({ pending: false });
          });
      } else {
        this.setState({ results: [] });
      }
    }
  }, 500);

  handleError = err => {
    console.error(err);
    this.setState({ serverError: true });
  };

  render() {
    const {
      results,
      search,
      typing,
      pending,
      resources,
      serverError,
    } = this.state;

    let content;
    if (serverError) {
      content = (
        <p className="Message Message-error">Could not reach the server.</p>
      );
    } else if (pending) {
      content = <p className="Message">Searching...</p>;
    } else if (search && !typing) {
      content = <Results results={results} />;
    }

    return (
      <div>
        <header className="App-header">
          <h1 className="App-title content-justified">
            Search for Star Wars data
          </h1>
        </header>
        <Search
          search={search}
          resources={resources}
          onSearchChange={this.handleSearchChange}
          onFilterChange={this.handleFilterChange}
          onFilterAll={this.handleFilterAll}
        />
        <div className="content-justified">{content}</div>
      </div>
    );
  }
}

export default withRouter(App);
