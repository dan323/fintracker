import React from "react";
import "./toggle-switch-binary.css"
import ToggleMultiple from "./ToggleMultiple";

interface ToggleProps {
    className: string,
    textOn: string,
    textOff: string,
    onToggle: (b: boolean) => void,
    label: string,
}

const Toggle: React.FC<ToggleProps> = ({className, textOn, textOff, onToggle, label}) => {
    const map:Map<string,string> = new Map();
    map.set('on', textOn);
    map.set('off', textOff);
    return (<ToggleMultiple<string> onToggle={(st) => onToggle(st === 'on')} className={className} label={label} states={['on','off']} stateTexts={map} />)
}

export default Toggle;