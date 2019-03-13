import React, { PureComponent } from 'react';
import { allStatuses, Status, defaultPollingRate } from "../../api";
import { URLS } from "../../api/urls";
import StatusLight from "../statusLight/StatusLight";

import "./App.css";

interface IAppProps { }

interface IAppState {
  statuses: Status[] | null
}

class App extends PureComponent<IAppProps, IAppState> {

  private interval: any = null;

  state = {
    statuses: null
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
    this.setState({ statuses })
  }

  renderStatuses = (statuses: Status[] | null) => {
    if (!statuses) {
      return null;
    }
    return statuses.map((s, i) => <StatusLight key={i} system={s.system} text={s.task} type={s.status} />)
  }

  render() {
    return (
      <div className="app">
        {this.renderStatuses(this.state.statuses)}
      </div>
    );
  }
}

export default App;
