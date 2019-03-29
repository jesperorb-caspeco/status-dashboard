import React, { PureComponent } from "react";
import Switch from "react-switch";
import { allStatuses, Status, defaultPollingRate, compareStatuses, setStatusesInLocalStorage, saveTheme, getTheme } from "../../api";
import { URLS } from "../../api/urls";
import StatusLight from "../statusLight/StatusLight";

import "./App.css";

interface IAppProps {
  statuses: Status[];
}

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
    checked: true
  };

  async componentDidMount() {
    const { statuses } = this.props;
    this.setState({ statuses }, this.allStatuses)
    this.interval = setInterval(this.allStatuses, defaultPollingRate);
    this.handleChange(getTheme());
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
    }, this.setInLocalStorage);
  };

  private setInLocalStorage = () => {
    setStatusesInLocalStorage(this.state.statuses);
  }

  private setTheme = (checked: boolean): void => {
    let bg = checked ? "#f1f1f1" : "#333";
    let text = checked ? "#333" : "#f1f1f1";
    const root = document.documentElement;
    root.style.setProperty("--text-color", text);
    root.style.setProperty("--bg-color", bg);
    saveTheme(checked);
  };

  private handleChange = (checked: boolean): void => {
    this.setTheme(checked);
    this.setState({ checked });
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
        days={s.days}
        hours={s.hours}
        minutes={s.minutes}
      />
    ));
  };

  render() {
    const checked = <div style={{ paddingTop: 2, paddingLeft: 4 }}>🌝</div>;
    const unchecked = <div style={{paddingTop: 2, paddingLeft: 4 }}>🌛</div>;
    return (
      <div className="app">
        <div className="last-updated">
          Senast uppdaterad:{" "}
          {this.state.lastUpdated && this.state.lastUpdated.toLocaleString("sv-SE")}
        </div>
        <div className="toggle-switch">
          <Switch onColor="#80adfa" checkedIcon={checked} uncheckedIcon={unchecked} onChange={this.handleChange} checked={this.state.checked} />
        </div>
        {this.renderStatuses(this.state.statuses)}
      </div>
    );
  }
}

export default App;
