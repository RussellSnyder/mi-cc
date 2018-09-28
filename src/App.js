import React, { Component } from 'react';
import './App.css';
import moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        error: null,
        isLoaded: false,
        events: [],
        sortedBy: null,
        sortDirection: 'asc',
        eventsShowingCount: 10
    };
  }

  componentDidMount() {
    fetch("http://develop.mitra-intelligence.com/test/tickets")
        .then(res => res.json())
        .then(
            (result) => {
            let enrichedResults = result.data.map(event => {
                if (event.title.length < 1) {
                    event.title = "Title Not Entered"
                }
                return event
            });
              this.setState({
                isLoaded: true,
                events: enrichedResults,
              });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
        )
  }

  render() {
    const events = !this.state.isLoaded
        ? <tr className="loading"><td>Loading</td></tr>
        : this.state.events.slice(0, this.state.eventsShowingCount).map((event, i) => {
        return (
            <tr key={i}>
                <td>{event.title}</td>
                <td>{event.price} $</td>
                <td>{moment(event.event_period.event.created_at).format('MMMM Do YYYY, h:mm:ss a')}</td>
            </tr>
            )
        })


    return (
      <div className="App">
      <h1 className="text-center p-3 mb-4">Mitra Coding Challenge</h1>
        <div className="container">
            <button onClick={() => this.sortBy("id")} className="btn btn-primary my-4">default sorting</button>

            <table className="table">
                <thead>
                <tr>
                    <th scope="col" onClick={() => this.sortBy("title")}>Title</th>
                    <th scope="col" onClick={() => this.sortBy("price")}>Price</th>
                    <th scope="col" onClick={() => this.sortBy("createdAt")}>Created at</th>
                </tr>
                </thead>
                <tbody>
                    {events}
                </tbody>
            </table>
            {this.state.eventsShowingCount < this.state.events.length
                ? <button className="btn btn-primary my-4"
                        onClick={() => this.setState({eventsShowingCount: this.state.eventsShowingCount += 10})}
                >Show 10 More Events ({this.state.events.length - this.state.eventsShowingCount} more)</button>
                : null
            }
        </div>
      </div>
    );
  }
    sortBy(type) {
        let sortedEvents = this.state.events;
        switch (type){
            case 'title':
                if (this.state.sortedBy === 'title') {
                    break
                }
                this.setState({
                    sortedBy: 'title'
                })
                sortedEvents = this.sortByTitle(sortedEvents);
                break;
            case 'price':
                if (this.state.sortedBy === 'price') {
                    break
                }
                this.setState({
                    sortedBy: 'price'
                })
                sortedEvents = this.sortByPrice(sortedEvents)
                break;
            case 'createdAt':
                if (this.state.sortedBy === 'createdAt') {
                    break
                }
                this.setState({
                    sortedBy: 'createdAt'
                })
                sortedEvents = this.sortByCreatedDate(sortedEvents)
                break;
            case 'id':
                if (this.state.sortedBy === 'id') {
                    break
                }
                this.setState({
                    sortedBy: 'id'
                })
                sortedEvents = this.sortById(sortedEvents);
                break;

        }

        this.setState({
            events: sortedEvents
        })
    }

    sortByTitle(sortedEvents) {
        return sortedEvents.sort((a,b) => {
            if(a.title < b.title) return -1;
            if(a.title > b.title) return 1;
            return 0;
        })
    }

    sortByPrice(sortedEvents) {
        return sortedEvents.sort((a,b) => {
            return a.price - b.price;
        })
    }

    sortByCreatedDate(sortedEvents) {
        return sortedEvents.sort((a,b) => {
            return parseInt(moment(a.event_period.event.created_at).format("YYYYMMDDHmmss")) - parseInt(moment(b.event_period.event.created_at).format("YYYYMMDDHmmss"));
        })
    }

    sortById(sortedEvents) {
        return sortedEvents.sort((a,b) => {
            return a.id - b.id;
        })
    }
}

export default App;
