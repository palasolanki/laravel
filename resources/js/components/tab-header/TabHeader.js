import React, { Component } from 'react';
import Tab from "./tab/Tab";

export default class TabHeader extends Component {

  constructor(props) {
    super(props);
    this.tabTitleRef = [];
    this.state = {
      activeTabIndex: 0,
      activeContenteditable: false,
      tabs: [
        {title: 'Tab 1'},
        {title: 'Tab 2'},
        {title: 'Tab 3'},
      ]
    };

    this.onTabClick = this.onTabClick.bind(this);
    this.addTabs = this.addTabs.bind(this);
    this.onTabDoubleClick = this.onTabDoubleClick.bind(this);
  }

  onTabClick(tabIndex) {
    this.setState({
      activeTabIndex: tabIndex
    });
  }

  onTabDoubleClick(tabIndex, e) {

    this.tabTitleRef[tabIndex].querySelector('div').contentEditable = true;
    // if(this.tabTitleRef[tabIndex]) {
    //   console.log(this.tabTitleRef[tabIndex]);
    //   setTimeout(() => {
    //     this.tabTitleRef[tabIndex].focus();
    //   }, 300)
    // }
    // this.setState({
    //   activeContenteditable: tabIndex
    // });
   // this.tabTitleRef[tabIndex].focus();

  }

  onTabBlur(tabIndex) {
    this.setState({
      activeContenteditable: null
    });
  }

  // handleClickOutside(e) {
  //   if (this.tabTitleRef[this.state.activeContenteditable].contains(e.target)) {
  //     return;
  //   }
  //   else {
  //     this.setState({
  //       activeContenteditable: null,
  //     })
  //   }
  // }

  addTabs() {
    this.state.tabs.push({title: `Tab ${this.state.tabs.length + 1}`}) ;

     this.setState({
       tabs: this.state.tabs,
       activeTabIndex: this.state.tabs.length - 1
     });
  }

  render() {
    const { activeTabIndex, tabs, activeContenteditable } = this.state;

    return (
      <div style={{marginTop: '10px'}}>
      <ul className="nav nav-tabs">
        {tabs.map((tab, i) => {
          return <Tab key={i}
              tabRef={tabTitleRef => (this.tabTitleRef[i] = tabTitleRef)}
              isContentEditable={(activeContenteditable === i)}
              isActive={(activeTabIndex === i)}
              onTabClick={() => this.onTabClick(i)}
              onTabDoubleClick={() => this.onTabDoubleClick(i)}
              onTabBlur={() => this.onTabBlur(i)}
              title={tab.title}
           />
        })}
        <li className="position-relative add-tab-item"><div className="add-tabs" onClick={this.addTabs}>+</div></li>
        </ul>
      </div>
    )
  }
}