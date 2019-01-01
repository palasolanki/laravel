import React, { Component } from 'react';
import Tab from "./tab/Tab";

export default class TabHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTabIndex: 0
    };

    this.onTabClick = this.onTabClick.bind(this);
    this.tabs = [
      {title: 'Tab 1'},
      {title: 'Tab 2'},
      {title: 'Tab 3'},
    ];
  }

  onTabClick(tabIndex) {
    this.setState({
      activeTabIndex: tabIndex
    });
  }

  render() {
    const { activeTabIndex } = this.state;

    return (
      <div style={{marginTop: '10px'}}>
      <ul className="nav nav-tabs">
        {this.tabs.map((tab, i) => {
          return <Tab key={i}
              isActive={(activeTabIndex === i)}
              onTabClick={() => this.onTabClick(i)}
              title={tab.title}/>
        })}
        </ul>
      </div>
    )
  }
}