import React from 'react'
import { LinkWithDropdown } from 'react-foundation-components/lib/global/dropdown'

//import Icon from 'app/components/elements/Icon'
import VerticalMenu from '../elements/VerticalMenu'

const FoundationDropdownMenu = ({menu, label, dropdownPosition, dropdownAlignment, className, onClick}) => {
    return <LinkWithDropdown
        closeOnClickOutside
        dropdownClassName={className}
        dropdownPosition={dropdownPosition}
        dropdownAlignment={dropdownAlignment}
        dropdownContent={
                                <VerticalMenu items={menu} />
                              }
        onClick={onClick}
    >
        <span className="FoundationDropdownMenu__label">
            {/*icon && <Icon name="share" className="space-right" />*/}
            {label}
            <img src='/icons/caret-down.svg' style={{ marginLeft: '2px', verticalAlign: 'middle', height: '15px '}} />
        </span>
    </LinkWithDropdown>;
}

export default FoundationDropdownMenu;
