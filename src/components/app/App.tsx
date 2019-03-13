import React, { PureComponent } from 'react';
import { allStatuses, Status, defaultPollingRate, compareStatuses } from "../../api";
import { URLS } from "../../api/urls";
import StatusLight from "../statusLight/StatusLight";

import "./App.css";

interface IAppProps { }

interface IAppState {
  statuses: Status[];
  lastUpdated: Date;
}

class App extends PureComponent<IAppProps, IAppState> {

  private interval: any = null;

  state = {
    statuses: [],
    lastUpdated: new Date()
  }

  async componentDidMount() {
    this.allStatuses();
    this.interval = setInterval(this.allStatuses, defaultPollingRate);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  private allStatuses = async (): Promise<void> => {
    const statuses = await allStatuses(URLS);
    this.setState((previousState: IAppState) => {
      return {
        statuses: compareStatuses(previousState.statuses, statuses),
        lastUpdated: new Date()
      }
    })
  }

  renderStatuses = (statuses: Status[] | null) => {
    if (!statuses) {
      return null;
    }
    return statuses
      .map((s, i) => <StatusLight 
                        key={i}
                        system={s.system}
                        text={s.task}
                        type={s.status}
                        hours={s.hours}
                        minutes={s.minutes}
                    />
      )
  }

  render() {
    return (
      <div className="app">
        <div className="last-updated">Senast uppdaterad: { this.state.lastUpdated && this.state.lastUpdated.toLocaleString('sv-SE')}</div>
        {this.renderStatuses(this.state.statuses)}
      </div>
    );
  }
}

export default App;
