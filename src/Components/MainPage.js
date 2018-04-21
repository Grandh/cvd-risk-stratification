import React, { Component } from 'react'
import './MainPage.css'
import WrapperSCOREView from './SCOREView'
import WrapperFraminghanView from './FraminghanView'
import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

export default class MainPage extends Component {
    render () {
        return (
            <div className='main-page-container'>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="SCORE模型" key="1">
                      <div className='model-view-container' >
                        <WrapperSCOREView />
                      </div>
                    </TabPane>
                    <TabPane tab="Framinghan模型" key="2">
                      <div className='model-view-container' >
                        <WrapperFraminghanView />
                      </div>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}