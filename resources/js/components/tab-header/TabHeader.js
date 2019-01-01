import React, { Component } from 'react';
import Tab from "./tab/Tab";

export default class TabHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTabIndex: 0,
      tabs: [
        {title: 'Tab 1'},
        {title: 'Tab 2'},
        {title: 'Tab 3'},
      ]
    };

    this.onTabClick = this.onTabClick.bind(this);
    this.addTabs = this.addTabs.bind(this);
  }

  onTabClick(tabIndex) {
    this.setState({
      activeTabIndex: tabIndex
    });
  }

  addTabs() {
    this.state.tabs.push({title: `Tab ${this.state.tabs.length + 1}`}) ;

     this.setState({
       tabs: this.state.tabs,
       activeTabIndex: this.state.tabs.length - 1
     });
  }

  render() {
    const { activeTabIndex, tabs } = this.state;

    return (
      <div style={{marginTop: '10px'}}>
      <ul className="nav nav-tabs">
        {tabs.map((tab, i) => {
          return <Tab key={i}
              isActive={(activeTabIndex === i)}
              onTabClick={() => this.onTabClick(i)}
              title={tab.title}/>
        })}
        <li className="position-relative add-tab-item"><div className="add-tabs" onClick={this.addTabs}>+</div></li>
        </ul>
      </div>
    )
  }
}