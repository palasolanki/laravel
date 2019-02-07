import React, { Component } from 'react';
import Tab from "./tab/Tab";
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { setTable, setTab, deleteTab, setTabAdded, setDeletedTab, setTabTitle, getProjectData, resetProject } from '../../store/actions/project';
class TabHeader extends Component {

  constructor(props) {
    super(props);
    this.tabTitleRef = [];
    this.isDoubleClick = false;
    this.state = {
      activeContenteditable: false,
      visibleDropdown: false,
      showConfirmationPopup: false
    };
    this.isOnMounted = true;
    this.onTabClick = this.onTabClick.bind(this);
    this.addTabs = this.addTabs.bind(this);
    this.onTabDoubleClick = this.onTabDoubleClick.bind(this);
    this.onTabKeyPress = this.onTabKeyPress.bind(this);

    this.showDropdown = this.showDropdown.bind(this);
    this.deleteActiveTab = this.deleteActiveTab.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
    this.getCurrentTabIndex = this.getCurrentTabIndex.bind(this);
    this.confirmDeleteTab = this.confirmDeleteTab.bind(this);
    this.backToDropdown = this.backToDropdown.bind(this);
    this.onEditBtn = this.onEditBtn.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onClickOutside);
  }

  componentWillUnmount() {
    if (this.isOnMounted) {
      this.props.resetProject(this.props.project);
    }
    document.removeEventListener('mousedown', this.onClickOutside, true);
  }

  componentDidUpdate() {
    const { newTabAdded, tabs, tabDeleted } = this.props;
    const tabIndex = tabs.length - 1;

    if (newTabAdded) {
      this.props.setTable({ tabId: tabs[tabIndex]._id });
      this.props.history.push(`/project/${tabs[tabIndex]._id}`);
      this.props.setTabAdded(false);
    }

    if (tabDeleted) {
      this.props.setTable({ rows: tabs[0].rows, tabId: tabs[0]._id });
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
    this.isOnMounted = false;
    const { tabs } = this.props;

    this.props.setTable({ rows: tabs[tabIndex].rows || [], tabId: tabs[tabIndex]._id });
    setTimeout(() => {
      if (!this.isDoubleClick) {
        this.props.history.push(`/project/${tabs[tabIndex]._id}`);
        this.isOnMounted = true;
      }
    });
  }

  onTabDoubleClick(tabIndex) {
    this.isDoubleClick = true;
    this.setState({
      visibleDropdown: false,
      activeContenteditable: tabIndex
    })
    this.tabTitleRef[tabIndex].querySelector('div').contentEditable = true;
    this.tabTitleRef[tabIndex].querySelector('div').focus();

  }

  onTabBlur(tabIndex, e) {
    this.isDoubleClick = false;
    let tabs = [...this.props.tabs];

    this.tabTitleRef[tabIndex].querySelector('div').contentEditable = false;

    if (!e.target.innerHTML) {
      e.target.innerHTML = tabs[tabIndex].title;
    }
    else if (this.state.activeContenteditable !== false) {
      this.props.setTabTitle({ title: (e.target.innerHTML).replace(/&nbsp;/g, '') }, this.props.activeTabId);
    }
    this.setState({
      activeContenteditable: false
    })

  }

  onTabKeyPress(tabIndex, e) {

    let tabs = [...this.props.tabs];

    if (e.charCode === 13) {
      if (!e.target.innerHTML) {
        e.target.innerHTML = tabs[tabIndex].title;
      }
      this.tabTitleRef[tabIndex].querySelector('div').contentEditable = false;
    }
  }

  addTabs() {
    this.props.setTab({
      title: `Tab ${this.props.tabs.length + 1}`,
    }, this.props.projectId);
  }

  showDropdown(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      visibleDropdown: !this.state.visibleDropdown,
      showConfirmationPopup: false
    });
  }

  getCurrentTabIndex() {
    const { tabs, tabId } = this.props;

    return tabs.findIndex((tab) => {
      return (tab._id === tabId);
    });
  }

  onClickOutside(e) {
    const tabIndex = this.getCurrentTabIndex();

    if (this.tabTitleRef[tabIndex] && !this.tabTitleRef[tabIndex].contains(e.target)) {
      this.setState({
        visibleDropdown: false,
        showConfirmationPopup: false
      });
    }
  }

  confirmDeleteTab(i) {
    this.setState({
      showConfirmationPopup: true
    });
  }
  backToDropdown() {
    this.setState({
      showConfirmationPopup: false
    });
  }

  deleteActiveTab(tabIndex) {
    let tabs = [...this.props.tabs];
    this.props.deleteTab(tabs[tabIndex]._id);

    this.setState({
      visibleDropdown: false,
      showConfirmationPopup: false
    });
  }

  onEditBtn(tabIndex) {
    this.onTabDoubleClick(tabIndex);
  }

  render() {
    const { activeContenteditable, visibleDropdown, showConfirmationPopup } = this.state;
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
              onTabBlur={(e) => this.onTabBlur(i, e)}
              title={tab.title}
              showDropdown={this.showDropdown}
              visibleDropdown={visibleDropdown}
              deleteActiveTab={() => this.deleteActiveTab(i)}
              tabLength={tabs.length}
              showConfirmationPopup={showConfirmationPopup}
              confirmDeleteTab={() => this.confirmDeleteTab(i)}
              backToDropdown={this.backToDropdown}
              onEditBtn={() => this.onEditBtn(i)}
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
    rows: state.project.rows,
    tabs: state.project.tabs,
    tabId: state.project.tabId,
    projectId: state.project._id,
    activeTabId: state.project.tabId,
    newTabAdded: state.project.newTabAdded,
    tabDeleted: state.project.tabDeleted,
    updatedTabTitle: state.project.updatedTabTitle,
    project: state.project
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setTable: data => dispatch(setTable(data)),
    setTab: (data, projectId) => dispatch(setTab(data, projectId)),
    deleteTab: (activeTabId) => dispatch(deleteTab(activeTabId)),
    setTabAdded: (flag) => dispatch(setTabAdded(flag)),
    setDeletedTab: (flag) => dispatch(setDeletedTab(flag)),
    setTabTitle: (data, activeTabId) => dispatch(setTabTitle(data, activeTabId)),
    getProjectData: tabId => dispatch(getProjectData(tabId)),
    resetProject: data => dispatch(resetProject(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TabHeader));