import React, { Component } from 'react'
import { Form, Input, Tooltip, Icon, Cascader, Select, Button, notification, message, Radio } from 'antd';
import caculateScoreModel from './Model/SCOREModel'
import { checkNumberInput } from './Model/FraminghanModel'
import CustomWithUnitInput from './CustomWithUnitInput'
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

class SCOREView extends Component {

    state = {
      confirmDirty: false,
    };

    openNotification = (type, title, desc) => {
        notification[type]({
            message: title,
            description: desc
        })
    }
    showMessage = (type, content) => {
       if (type === 'success') {
           message.success(content)
       } else if (type === 'error') {
           message.error(content)
       } else if ( type === 'warning') {
           message.warning(content)
       }
    }

      handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            var {sex, age, smoker, systolic, cholesterol} = values
            var flag = true 

            let age = checkNumberInput(age, this.showMessage, '患者年龄输入可能有误')
            if ( age ) {
              if (age < 40) {
                this.showMessage('error', "SCORE模型支持40岁以上患者的CVD风险评估，请考虑其他模型")
                flag = false;
              }
            }
            systolic = checkNumberInput(systolic, this.showMessage, '舒张压输入可能有误')
            cholesterol.number = checkNumberInput(cholesterol.number, this.showMessage, '舒张压输入可能有误') 

            if ( age === null || systolic===null || cholesterol.number === null ) flag = false
            if (flag) caculateScoreModel ({sex, age, smoker, systolic, cholesterol }, this.openNotification) 
            
          }
        });
      }

      checkCholesterol = (rule, value, callback) => {
        if (value.number >= 0) {
          callback();
          return;
        }
        callback('胆固醇输入可能有误！')
      }

      render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;
    
        const formItemLayout = {
          labelCol: {
            xs: { span: 12 },
            sm: { span: 6 },
          },
          wrapperCol: {
            xs: { span: 12 },
            sm: { span: 12 },
          },
        };
        const tailFormItemLayout = {
          wrapperCol: {
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 16,
              offset: 8,
            },
          },
        };
        const prefixSelector = getFieldDecorator('prefix', {
          initialValue: '86',
        })(
          <Select style={{ width: 70 }}>
            <Option value="86">+86</Option>
            <Option value="87">+87</Option>
          </Select>
        );

        return (
          <Form onSubmit={this.handleSubmit}>

            <FormItem
              {...formItemLayout}
              label='性别'
            >
              {getFieldDecorator('sex', 
              {
                initialValue: 'male',
                rules: [{
                  rules: [{ required: true, message: '请选择患者性别', whitespace: true }],
                },]
              })(
                <RadioGroup style={{marginLeft: '5%'}}>
                  <Radio value={'male'}>男</Radio>
                  <Radio value={'female'}>女</Radio>
                </RadioGroup>
              )}
            </FormItem>

            <FormItem
            {...formItemLayout}
            label={(
              <span>
                  年龄&nbsp;
                  <Tooltip title="该模型适用于40岁以上人群">
                      <Icon type="info-circle-o" />
                  </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('age', {
              rules: [{
                required: true, message: '请输入患者年龄',
              }, ],
            })(
              <Input />
            )}
          </FormItem>

            <FormItem
              {...formItemLayout}
              label={(
                <span>
                    是否吸烟&nbsp;
                    <Tooltip title="近12个月有吸烟习惯即可确定">
                    <Icon type="question-circle-o" />
                    </Tooltip>
                </span>
              )}
            >
              {getFieldDecorator('smoker',{
                initialValue: 'no',
            })(
              <RadioGroup style={{marginLeft: '5%'}}>
                <Radio value={'no'}>否</Radio>
                <Radio value={'yes'}>是</Radio>
              </RadioGroup>
              )}
            </FormItem>
            
           <FormItem
            {...formItemLayout}
            label='收缩压'
          >
            {getFieldDecorator('systolic', {
              rules: [{
                required: true, message: '请输入患者收缩压',
              },
              ],
            })(
              <Input />
            )}
          </FormItem>

           <FormItem
            {...formItemLayout}
            label='胆固醇'
          >
            {getFieldDecorator('cholesterol', {
              initialValue: {number: '', unit: 'mmol'},
              rules: [{
                validator: this.checkCholesterol,
              },],
            })(
              <CustomWithUnitInput />
            )}
          </FormItem>

            <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">风险评估</Button>
            </FormItem>
          </Form>
        );
    }
}

const WrapperSCOREView = Form.create()(SCOREView)

export default WrapperSCOREView
