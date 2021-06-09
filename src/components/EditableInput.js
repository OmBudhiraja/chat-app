import React, {useCallback, useState} from 'react'
import { Icon, InputGroup, Input, Alert } from 'rsuite'

const EditableInput = (props)=>{
    const {
        initialValue,
        onSave,
        label=null,
        placeholder="Write your Value",
        emptyMsg="Input field cannot be empty",
        wrapperClass="",
        ...inputProps
        } = props

    const [input, setInput] = useState(initialValue)
    const [isEditable, setIsEditable] = useState(false)

    const onInputChange = useCallback((value)=>{
        setInput(value)
    }, [])

    const onEditClick = useCallback(()=>{
        setIsEditable(prev => !prev)
        setInput(initialValue)
    }, [initialValue])

    const onSaveClick = async ()=>{
        const trimmed = input.trim()
        if(trimmed === ""){
            Alert.error(emptyMsg, 4000)
            setInput(initialValue)
        }
        if(trimmed !== "" && trimmed !== initialValue){
            await onSave(trimmed)
        }
        setIsEditable(false)
    }

    return <div className={wrapperClass}>
        {label}
        <InputGroup>
            <Input
            {...inputProps}
            placeholder={placeholder} 
            value={input}
            onChange={onInputChange}
            disabled={!isEditable}
            autoComplete="off"
                />
            
            <InputGroup.Button onClick={onEditClick}>
               <Icon icon={isEditable ? 'close': 'edit2'} />
            </InputGroup.Button>
            
            {isEditable && (
            <InputGroup.Button onClick={onSaveClick}>
                 <Icon icon="check" />
            </InputGroup.Button>
            )}
        </InputGroup>
    </div>
}

export default EditableInput