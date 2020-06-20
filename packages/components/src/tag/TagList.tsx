import React, {useState, useRef, useEffect, useMemo} from 'react'
import {Tag, Input, Tooltip} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
interface TagListProps {
  value?: string[] | string
  onChange?: (value: string[] | string) => void
}
const TagList: React.FC<TagListProps> = ({value, onChange}) => {
  const tags = useMemo(() => {
    if (!value) return []
    if (typeof value === 'string') return value.split(',')
    else return value
  }, [value])
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag)
    if (Array.isArray(value)) return onChange(newTags)
    return onChange(newTags.join(','))
  }
  const input = useRef<Input>(null)
  useEffect(() => {
    input.current && input.current.focus()
  }, [inputVisible])
  const showInput = () => {
    setInputVisible(true)
  }

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      let newTags = [...tags, inputValue]
      if (Array.isArray(value)) {
        onChange(newTags)
      } else {
        onChange(newTags.join(','))
      }
    }

    setInputVisible(false)
    setInputValue('')
  }
  return (
    <div>
      {tags.map((tag, index) => {
        const isLongTag = tag.length > 20
        const tagElem = (
          <Tag key={tag} closable={true} onClose={() => handleClose(tag)}>
            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
          </Tag>
        )
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        )
      })}
      {inputVisible && (
        <Input
          ref={input}
          type="text"
          size="small"
          style={{width: 78}}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag className="site-tag-plus" onClick={showInput}>
          <PlusOutlined />
        </Tag>
      )}
    </div>
  )
}
export default TagList
