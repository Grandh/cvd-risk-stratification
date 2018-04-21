import React, { Component } from 'react'
import { Form, Input, Tooltip, Icon, Cascader, Select, Button, notification, message, Radio } from 'antd';
import caculateFraminghanModel, {checkNumberInput} from './Model/FraminghanModel.js'
import CustomWithUnitInput from './CustomWithUnitInput'
const RadioGroup = Radio.Group
const FormItem = Form.Item
const Option = Select.Option

class FraminghanView extends Component {

    state = {
      confirmDirty: false,
      modelType: 'LDL' // Chol
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
          var {sex, age, ldlOrChol, hdl, systolic, diastolic, diabetes, smoker} = values
          ldlOrChol.type = this.state.modelType
          // 进行计算前的校验
          var flag = true 
          let age = checkNumberInput(age, this.showMessage, '患者年龄输入可能有误')
          if ( age ) {
            if (age < 30 || age > 74) {
              this.showMessage('error', "Framinghan模型支持30-74岁患者的CVD风险评估")
              flag = false
            }
          }

          ldlOrChol.number = checkNumberInput(ldlOrChol.number, this.showMessage, 'LDC或胆固醇输入可能有误') 
          hdl.number = checkNumberInput(hdl.number, this.showMessage, 'HDL-C输入可能有误')
          systolic = checkNumberInput(systolic, this.showMessage, '收缩压输入可能有误')
          diastolic = checkNumberInput(diastolic, this.showMessage, '舒张压输入可能有误')

          if ( age === null || ldlOrChol.number === null || hdl.number === null
               || systolic === null || diastolic === null ) { flag = false }
          if (flag) {
              caculateFraminghanModel ({sex, age, ldlOrChol, hdl, systolic, diastolic, diabetes, smoker}, this.openNotification) 
          }
        }
      })
    }

      checkLDLOrCholesterol = (rule, value, callback) => {
        if (value.number >= 0) {
          callback();
          return;
        }
        switch(this.state.modelType) {
          case 'LDL':callback('低密度脂蛋白输入可能有误！')
            break;
          case 'Chol':callback('胆固醇输入可能有误！')
            break
        }
      }

      changeModeType = (mv) => {
        this.setState({
          modelType: mv
        })
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
                  <Tooltip title="该模型适用于30-74岁人群">
                      <Icon type="info-circle-o" />
                  </Tooltip>
              </span>
            )}
          >
            {getFieldDecorator('age', {
              rules: [{
                required: true, message: '请输入患者年龄',
              },],
            })(
              <Input />
            )}
          </FormItem>

           <FormItem
            {...formItemLayout}
            label={
              <Select 
                defaultValue={this.state.modelType} 
                onChange={this.changeModeType}
                style={{marginRight:'5px', 'maxWidth':'100px'}}
              >
                <Option value="LDL">LDL</Option>
                <Option value="Chol">胆固醇</Option>
              </Select>
            }
          >
            {getFieldDecorator('ldlOrChol', {
              initialValue: {number: '', unit: 'mmol'},
              rules: [{
                validator: this.checkLDLOrCholesterol,
              },],
            })(
              <CustomWithUnitInput />
            )}
          </FormItem>

           <FormItem
            {...formItemLayout}
            label='HDL-C'
          >
            {getFieldDecorator('hdl', {
              initialValue: {number: '', unit: 'mmol'},
              rules: [{
                validator: this.checkLDLOrCholesterol,
              },],
            })(
              <CustomWithUnitInput />
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
            label='舒张压'
          >
            {getFieldDecorator('diastolic', {
              rules: [{
                required: true, message: '请输入患者舒张压',
              },
              ],
            })(
              <Input />
            )}
          </FormItem>

            <FormItem
              {...formItemLayout}
              label="是否患糖尿病"
            >
              {getFieldDecorator('diabetes',{
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
            
            <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">风险评估</Button>
            </FormItem>

          </Form>
        );
    }
}

const WrapperFraminghanView = Form.create()(FraminghanView)

export default WrapperFraminghanView
