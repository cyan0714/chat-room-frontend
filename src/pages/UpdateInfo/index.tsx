import { Button, Col, Form, Input, message, Row } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useCallback, useEffect } from 'react'
import './index.css'
// import { useNavigate } from 'react-router-dom'
import { getUserInfo, updateInfo, updateUserInfoCaptcha } from '../../interface/'
import { HeadPicUpload } from './HeadPicUpload'

export interface UserInfo {
  headPic: string
  nickName: string
  email: string
  captcha: string
}

const layout1 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

export function UpdateInfo() {
  const [form] = useForm()
  // const navigate = useNavigate()

  const onFinish = useCallback(async (values: UserInfo) => {
    const res = await updateInfo(values)

    if (res.status === 201 || res.status === 200) {
      message.success('用户信息更新成功')
    } else {
      message.error('系统繁忙，请稍后再试')
    }
  }, [])

  const sendCaptcha = useCallback(async function () {
    const res = await updateUserInfoCaptcha()
    if (res.status === 201 || res.status === 200) {
      message.success(res.data.data)
    } else {
      message.error('系统繁忙，请稍后再试')
    }
  }, [])

  useEffect(() => {
    async function query() {
      const res = await getUserInfo()
      const { data } = res

      if (res.status === 201 || res.status === 200) {
        form.setFieldValue('headPic', data.headPic)
        form.setFieldValue('nickName', data.nickName)
        form.setFieldValue('email', data.email)
      }
    }
    query()
  }, [])

  return (
    <div id='updateInfo-container'>
      <Form form={form} {...layout1} onFinish={onFinish} colon={false} autoComplete='off'>
        <Form.Item label='头像' name='headPic' rules={[{ required: false, message: '请输入头像!' }]}>
          <HeadPicUpload />
        </Form.Item>

        <Form.Item
          label='昵称'
          name='nickName'
          rules={[{ required: true, message: '请输入昵称!' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label='邮箱'
          name='email'
          rules={[
            { required: true, message: '请输入邮箱!' },
            { type: 'email', message: '请输入合法邮箱地址!' },
          ]}>
          <Input disabled />
        </Form.Item>

        <Form.Item
          label='验证码'
          name='captcha'
          rules={[{ required: true, message: '请输入验证码!' }]}>
          <Row gutter={8}>
            <Col span={14}>
              <Input />
            </Col>
            <Col span={10}>
              <Button type='primary' onClick={sendCaptcha}>
                发送验证码
              </Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item {...layout1} label=' '>
          <Button className='btn' type='primary' htmlType='submit'>
            修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
