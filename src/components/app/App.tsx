import React, { PureComponent } from "react";
import Switch from "react-switch";
import { allStatuses, Status, defaultPollingRate, compareStatuses } from "../../api";
import { URLS } from "../../api/urls";
import StatusLight from "../statusLight/StatusLight";

import "./App.css";

interface IAppProps {}

interface IAppState {
  statuses: Status[];
  lastUpdated: Date;
  checked: boolean;
}

class App extends PureComponent<IAppProps, IAppState> {
  private interval: any = null;

  state = {
    statuses: [],
    lastUpdated: new Date(),
    checked: false,
  };

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
        lastUpdated: new Date(),
      };
    });
  };

  private setTheme = (checked: boolean): void => {
    let bg = "#f1f1f1";
    let text = "#333333";
    if (checked) {
      bg = "#333333";
      text = "#f1f1f1";
    }
    const root = document.documentElement;
    root.style.setProperty("--text-color", text);
    root.style.setProperty("--bg-color", bg);
  };

  private handleChange = (checked: boolean): void => {
    this.setTheme(checked);
    this.setState(prev => ({ checked: !prev.checked }));
  };

  renderStatuses = (statuses: Status[] | null) => {
    if (!statuses) {
      return null;
    }
    return statuses.map((s, i) => (
      <StatusLight
        key={i}
        system={s.system}
        text={s.task}
        type={s.status}
        hours={s.hours}
        minutes={s.minutes}
      />
    ));
  };

  render() {
    return (
      <div className="app">
        <div className="last-updated">
          Senast uppdaterad:{" "}
          {this.state.lastUpdated && this.state.lastUpdated.toLocaleString("sv-SE")}
        </div>
        <div className="toggle-switch">
          <Switch onChange={this.handleChange} checked={this.state.checked} />
        </div>
        {this.renderStatuses(this.state.statuses)}
      </div>
    );
  }
}

export default App;
