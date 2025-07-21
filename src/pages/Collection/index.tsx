import { Table, message } from 'antd'
import { useEffect, useState } from 'react'
import type { ColumnsType } from 'antd/es/table'
import { queryFavoriteList } from '../../interface'

interface Favorite {
  id: number
  chatHistory: {
    id: number
    content: string
    type: number
    createTime: Date
  }
}

export function Collection() {
  const [favoriteList, setFavoriteList] = useState<Array<Favorite>>([])

  const columns: ColumnsType<Favorite> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '内容',
      render: (_, record) => (
        <div>
          {record.chatHistory.type === 0 ? (
            record.chatHistory.content
          ) : record.chatHistory.type === 1 ? (
            <img src={record.chatHistory.content} style={{ maxHeight: 200 }} />
          ) : (
            <a href={record.chatHistory.content} download>
              {record.chatHistory.content}
            </a>
          )}
        </div>
      ),
    },
    {
      title: '发表时间',
      render: (_, record) => <div>{new Date(record.chatHistory.createTime).toLocaleString()}</div>,
    },
    {
      title: '操作',
      render: (_, record) => (
        <div>
          <a href='' onClick={() => {}}>
            删除
          </a>
        </div>
      ),
    },
  ]

  const query = async () => {
    try {
      const res = await queryFavoriteList()

      if (res.status === 201 || res.status === 200) {
        setFavoriteList(
          res.data.map((item: Favorite) => {
            return {
              ...item,
              key: item.id,
            }
          })
        )
      }
    } catch (e) {
      message.error(e.response?.data?.message || '系统繁忙，请稍后再试')
    }
  }

  useEffect(() => {
    query()
  }, [])

  return (
    <div id='friendship-container'>
      <div className='favorite-table'>
        <Table columns={columns} dataSource={favoriteList} style={{ width: '1000px' }} />
      </div>
    </div>
  )
}
