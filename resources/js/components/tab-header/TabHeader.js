import React, { Component } from 'react';
import Tab from "./tab/Tab";
import { connect } from 'react-redux';
import { setTable } from '../../store/actions/project';

class TabHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTabIndex: 0,
      tabs: [
        { title: 'Tab 1' },
        { title: 'Tab 2' },
        { title: 'Tab 3' },
      ]
    };

    this.onTabClick = this.onTabClick.bind(this);
    this.addTabs = this.addTabs.bind(this);

    this.props.setTable({ tab: 0, rows: this.prepareRows(0) });
  }

  prepareRows(tabId) {
    const rows = [];
    for (let i = 1; i <= 3; i++) {
      rows.push({
        id: i, title: "Tab " + (tabId + 1), complete: (20 * i)
      });
    }

    return rows;
  }

  onTabClick(tabIndex) {
    this.props.setTable({ tab: tabIndex, rows: this.prepareRows(tabIndex) });

    this.setState({
      activeTabIndex: tabIndex
    });
  }

  addTabs() {
    const tabIndex = this.state.tabs.length;
    this.state.tabs.push({ title: `Tab ${this.state.tabs.length + 1}` });
    this.props.setTable({tab: tabIndex, rows: this.prepareRows(tabIndex)});

    this.setState({
      tabs: this.state.tabs,
      activeTabIndex: this.state.tabs.length - 1
    });
  }

  render() {
    const { activeTabIndex, tabs } = this.state;

    return (
      <div style={{ marginTop: '10px' }}>
        <ul className="nav nav-tabs">
          {tabs.map((tab, i) => {
            return <Tab key={i}
              isActive={(activeTabIndex === i)}
              onTabClick={() => this.onTabClick(i)}
              title={tab.title} />
          })}
          <li className="position-relative add-tab-item"><div className="add-tabs" onClick={this.addTabs}>+</div></li>
        </ul>
      </div>
    )
  }
}


const mapDispatchToProps = dispatch => {
  return {
    setTable: data => dispatch(setTable(data))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(TabHeader);