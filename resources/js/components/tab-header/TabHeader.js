import React, { Component } from 'react';
import Tab from "./tab/Tab";
import { connect } from 'react-redux';
import { setTable } from '../../store/actions/project';

class TabHeader extends Component {

  constructor(props) {
    super(props);
    this.tabTitleRef = [];
    this.state = {
      activeTabIndex: 0,
      activeContenteditable: false,
      tabLength: 0,
      tabs: [
        { title: 'Tab 1' },
        { title: 'Tab 2' },
        { title: 'Tab 3' },
      ],
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
      activeTabIndex: tabIndex,
    });
  }

  onTabDoubleClick(tabIndex) {
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
    const tabIndex = this.state.tabs.length;
    this.state.tabs.push({ title: `Tab ${this.state.tabs.length + 1}` });
    this.props.setTable({tab: tabIndex, rows: this.prepareRows(tabIndex)});

    this.setState({
      tabLength: this.state.tabs.length,
      tabs: this.state.tabs,
      activeTabIndex: this.state.tabs.length - 1
    });
  }

  showDropdown() {
      this.setState({
        visibleDropdown: !this.state.visibleDropdown
      })
  }

  deleteActiveTab(index) {
    let tabs = [...this.state.tabs];

    tabs.splice(index, 1);
    this.setState({
      activeTabIndex: 0,
      tabs: tabs,
      visibleDropdown: false,
    });


    setTimeout(() => {
      this.setState({
        tabLength: this.state.tabs.length
      });
    }, 100)

  }


  render() {
    const { activeTabIndex, tabs, activeContenteditable, visibleDropdown, tabLength } = this.state;

    return (
      <div className="position-relative">
      <ul className="nav nav-tabs">
        {tabs.map((tab, i) => {
          return <Tab key={i}
              tabRef={tabTitleRef => (this.tabTitleRef[i] = tabTitleRef)}
              isContentEditable={(activeContenteditable === i)}
              isActive={(activeTabIndex === i)}
              onTabClick={() => this.onTabClick(i)}
              onTabDoubleClick={() => this.onTabDoubleClick(i)}
              onTabKeyPress={(e) => this.onTabKeyPress(i, e)}
              onTabBlur={() => this.onTabBlur(i)}
              title={tab.title}
              showDropdown={this.showDropdown}
              visibleDropdown={visibleDropdown}
              deleteActiveTab={() => this.deleteActiveTab(i)}
              tabLength={tabLength}
           />
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