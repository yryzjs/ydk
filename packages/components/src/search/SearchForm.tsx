import React, {useState, useMemo} from 'react'
import {Col, Row} from 'antd'
import Form, {FormProps, useForm} from 'antd/lib/form/Form'
import {DownOutlined, UpOutlined} from '@ant-design/icons'
import {FormItem as SearchItem} from '../form'
import {SearchContext} from './SearchContainer'
export {SearchItem}
interface Props extends FormProps {
  itemSpan?: 8 | 12
}
const SearchForm: React.FC<Props> = ({itemSpan = 8, children, ...props}) => {
  const [expand, setExpand] = useState(false)
  const searchContext = React.useContext(SearchContext)
  let childs = useMemo(() => React.Children.toArray(children), [children])
  const searchItems = useMemo(() => {
    let searchItems: any[] = []
    let showCount = expand ? childs.length : Math.min(24 / itemSpan, childs.length)
    for (let index = 0; index < showCount; index++) {
      searchItems.push(
        <Col span={itemSpan} key={`col_${index}`}>
          {childs[index]}
        </Col>,
      )
    }
    return searchItems
  }, [childs, itemSpan, expand])
  const expandSpan = useMemo(() => {
    if (childs.length < 24 / itemSpan) return null
    return (
      <span style={{marginLeft: 8, fontSize: 12}} onClick={() => setExpand(!expand)}>
        {expand ? '收起' : '展开'}
        {expand ? <UpOutlined /> : <DownOutlined />}
      </span>
    )
  }, [childs, itemSpan, expand])
  const onFinish = async (values: any) => {
    values = {...props.initialValues, ...values}

    searchContext.setData(values)
  }

  return (
    <Form
      initialValues={searchContext.data}
      colon={false}
      onFinish={onFinish}
      className="search-form"
      layout="inline"
      {...props}>
      {searchItems}
      <Col span={itemSpan} key="sumbitButton">
        <SearchItem.SubmitButton title="搜索" />
        {expandSpan}
      </Col>
    </Form>
  )
}
export default SearchForm
