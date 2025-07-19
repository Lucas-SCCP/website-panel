import { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import type { ElementType } from 'website-lib'
import type { StylesConfig } from 'react-select'
import * as FaIcons from 'react-icons/fa'
import * as MdIcons from 'react-icons/md'

const allIcons = {
  ...FaIcons,
  ...MdIcons
}

const iconToOption = ([name, Icon]: [string, React.ComponentType<React.ComponentProps<'svg'>>]) => ({
  value: name,
  label: name,
  icon: <Icon />
})

const maxOptions = 28
const iconList = Object.entries(allIcons)
const initialOptions = iconList.slice(0, maxOptions).map(iconToOption)

export function IconElement({ element }: { element: ElementType }) {
  type OptionType = {
    value: string
    label: string
    icon?: React.ReactNode
  }

  const customStyles: StylesConfig<OptionType, false> = {
    menu: (base: object) => ({
      ...base,
      zIndex: 9999,
      width: 420
    }),
    menuList: (base: object) => ({
      ...base,
      display: 'flex',
      flexWrap: 'wrap' as const,
      maxHeight: 400,
      overflowY: 'auto'
    }),
    option: (base: object) => ({
      ...base,
      width: 100,
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 8,
      fontSize: 34
    }),
    singleValue: (base) => ({
      ...base,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      fontSize: 28
    })
  }

  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null)
  const [options, setOptions] = useState<OptionType[]>(initialOptions)

  useEffect(() => {
    if (!element.properties.name) return

    const iconEntry = iconList.find(([name]) => name === element.properties.name)
    const selected = iconEntry ? iconToOption(iconEntry) : null

    setSelectedOption(selected)

    if (selected) {
      const alreadyInInitial = initialOptions.some((opt) => opt.value === selected.value)
      if (alreadyInInitial) {
        setOptions(initialOptions)
      } else {
        const filteredInitial = initialOptions.filter((opt) => opt.value !== selected.value)
        setOptions([selected, ...filteredInitial.slice(0, maxOptions - 1)])
      }
    } else {
      setOptions(initialOptions)
    }
  }, [element.properties.name])

  const handleInputChange = (inputValue: string) => {
    if (!inputValue) {
      if (selectedOption) {
        const alreadyInInitial = initialOptions.some((opt) => opt.value === selectedOption.value)
        if (alreadyInInitial) {
          setOptions(initialOptions)
        } else {
          const filteredInitial = initialOptions.filter((opt) => opt.value !== selectedOption.value)
          setOptions([selectedOption, ...filteredInitial.slice(0, maxOptions - 1)])
        }
      } else {
        setOptions(initialOptions)
      }
    } else {
      const filtered = iconList
        .filter(([name]) => name.toLowerCase().includes(inputValue.toLowerCase()))
        .map(iconToOption)
        .filter((opt, i, arr) => arr.findIndex((o) => o.value === opt.value) === i) // remove duplicatas
        .slice(0, maxOptions)
      setOptions(filtered)
    }
  }

  return (
    <Form.Group className="mb-3">
      <Form.Label>Ícone</Form.Label>
      <Select
        id={`icon-select-${element.id}`}
        value={selectedOption}
        options={options}
        onChange={setSelectedOption}
        onInputChange={handleInputChange}
        formatOptionLabel={(option) => option.icon}
        styles={customStyles}
        isSearchable
      />
    </Form.Group>
  )
}
