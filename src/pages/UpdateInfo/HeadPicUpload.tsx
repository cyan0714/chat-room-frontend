import { InboxOutlined } from '@ant-design/icons'
import { message } from 'antd'
import Dragger, { type DraggerProps } from 'antd/es/upload/Dragger'
import axios from 'axios'
import { getOssInfo, presignedUrl } from '../../interface'

interface HeadPicUploadProps {
  value?: string
  onChange?: (value: string) => void
}
interface OssInfo {
  OSSAccessKeyId: string
  policy: string
  Signature: string
  host: string
}

let onUploadChange: (value: string) => void
const { data }: { data: OssInfo } = await getOssInfo()

const props: DraggerProps = {
  name: 'file',
  // 使用 Minio 搭建的 OSS 服务的上传方式:
  // action: async file => {
  //   const res = await presignedUrl(file.name)
  //   return res.data
  // },
  // 使用阿里云 OSS 服务的上传方式:
  action: async () => {
    return data.host
  },
  // 本地调试用:
  // action: 'http://localhost:3007/user/upload',
  async customRequest(options) {
    const { onSuccess, file, action } = options
    const formdata = new FormData()

    if (typeof file === 'string') {
      throw new Error('File must be a File object')
    }

    formdata.append('key', (file as File).name)
    formdata.append('OSSAccessKeyId', data.OSSAccessKeyId)
    formdata.append('policy', data.policy)
    formdata.append('signature', data.Signature)
    formdata.append('success_action_status', '200')
    formdata.append('file', file)

    const res = await axios.post(action, formdata)

    onSuccess!(res.data)
  },

  onChange(info) {
    // info: {
    //   file: {},
    //   fileList: []
    // }
    console.log('info')
    const { status } = info.file
    if (status === 'done') {
      onUploadChange(data.host + '/' + info.file.name)
      message.success(`${info.file.name} 文件上传成功`)
    } else if (status === 'error') {
      message.error(`${info.file.name} 文件上传失败`)
    }
  },
}

const dragger = (
  <Dragger {...props}>
    <p className='ant-upload-drag-icon'>
      <InboxOutlined />
    </p>
    <p className='ant-upload-text'>点击或拖拽文件到这个区域来上传</p>
  </Dragger>
)

export function HeadPicUpload(props: HeadPicUploadProps) {
  onUploadChange = props.onChange!

  return props?.value ? (
    <div>
      <img src={props.value} alt='头像' width='100' height='100' />
      {dragger}
    </div>
  ) : (
    <div>{dragger}</div>
  )
}
