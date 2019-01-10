import React, { Component } from 'react';
import Tab from "./tab/Tab";
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { setTable, setTab, deleteTab, setTabAdded, setDeletedTab } from '../../store/actions/project';
class TabHeader extends Component {

  constructor(props) {
    super(props);
    this.tabTitleRef = [];
    this.state = {
      activeContenteditable: false,
      visibleDropdown: false
    };

    this.onTabClick = this.onTabClick.bind(this);
    this.addTabs = this.addTabs.bind(this);
    this.onTabDoubleClick = this.onTabDoubleClick.bind(this);
    this.onTabKeyPress = this.onTabKeyPress.bind(this);

    this.showDropdown = this.showDropdown.bind(this);
    this.deleteActiveTab = this.deleteActiveTab.bind(this);
    this.props.setTable({ tab: 0, rows: this.prepareRows(0) });
  }

  componentDidUpdate() {
    const { newTabAdded, tabs, tabDeleted } = this.props;
    const tabIndex = tabs.length-1;
    const rows = this.prepareRows(tabIndex);

    if(newTabAdded) {
      this.props.setTable({ rows: rows, tabId: tabs[tabIndex]._id });
      this.props.history.push(`/project/${tabs[tabIndex]._id}`);
      this.props.setTabAdded(false);
    }

    if(tabDeleted) {
      this.props.setTable({ tabId: tabs[0]._id });
      this.props.history.push(`/project/${tabs[0]._id}`);
      this.props.setDeletedTab(false);
    }
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
    const {tabs} = this.props;
    this.props.setTable({ rows: this.prepareRows(tabIndex), tabId: tabs[tabIndex]._id });

    this.props.history.push(`/project/${tabs[tabIndex]._id}`);
  }

  onTabDoubleClick(tabIndex, e) {
    this.setState({
      visibleDropdown: false,
      activeContenteditable: tabIndex
    })
    this.tabTitleRef[tabIndex].querySelector('div').contentEditable = true;
    this.tabTitleRef[tabIndex].querySelector('div').focus();

  }

  onTabBlur(tabIndex) {
    this.tabTitleRef[tabIndex].querySelector('div').contentEditable = false;

    this.setState({
      activeContenteditable: false
    })
  }

  onTabKeyPress(tabIndex, e) {
    if(e.charCode === 13) {
      this.tabTitleRef[tabIndex].querySelector('div').contentEditable = false;
    }
  }

  addTabs() {
    const {tabs} = this.props;
    const tabIndex = tabs.length;
    const rows = this.prepareRows(tabIndex);

    this.props.setTab({
      title: `Tab ${this.props.tabs.length + 1}`,
      rows: rows
    }, this.props.projectId);
}

  showDropdown() {
      this.setState({
        visibleDropdown: !this.state.visibleDropdown
      })
  }

  deleteActiveTab(tabIndex) {
    let tabs = [...this.props.tabs];
    this.props.deleteTab(tabs[tabIndex]._id);
    this.setState({
      visibleDropdown: false,
    });
  }

  render() {
    const { activeContenteditable, visibleDropdown } = this.state;
    const { tabs, activeTabId } = this.props;

    return (
      <div className="position-relative">
      <ul className="nav nav-tabs">
        {tabs.map((tab, i) => {
          return <Tab key={i}
              tabRef={tabTitleRef => (this.tabTitleRef[i] = tabTitleRef)}
              isContentEditable={(activeContenteditable === i)}
              isActive={(activeTabId == tab._id)}
              onTabClick={() => this.onTabClick(i)}
              onTabDoubleClick={(e) => this.onTabDoubleClick(i, e)}
              onTabKeyPress={(e) => this.onTabKeyPress(i, e)}
              onTabBlur={() => this.onTabBlur(i)}
              title={tab.title}
              showDropdown={this.showDropdown}
              visibleDropdown={visibleDropdown}
              deleteActiveTab={() => this.deleteActiveTab(i)}
              tabLength={tabs.length}
           />
        })}
        <li className="position-relative add-tab-item"><div className="add-tabs" onClick={this.addTabs}>+</div></li>
        </ul>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    tabs: state.project.tabs,
    projectId: state.project._id,
    activeTabId: state.project.tabId,
    newTabAdded: state.project.newTabAdded,
    tabDeleted: state.project.tabDeleted
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setTable: data => dispatch(setTable(data)),
    setTab: (data, projectId) => dispatch(setTab(data, projectId)),
    deleteTab: (activeTabId) => dispatch(deleteTab(activeTabId)),
    setTabAdded: (flag) => dispatch(setTabAdded(flag)),
    setDeletedTab: (flag) => dispatch(setDeletedTab(flag))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TabHeader));