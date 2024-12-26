import React, { useState } from "react";
import "./toggle-switch.css"

interface ToggleProps<State> {
    className: string,
    states: State[],
    stateTexts: Map<State,string>,
    onToggle: (b: State) => void,
    label: string,
}

const ToggleMultiple = <T extends string | number | symbol | boolean>({
    className,
    states,
    stateTexts,
    onToggle,
    label,
  }: ToggleProps<T>): React.ReactElement => {
    const [activeState, toggle] = useState<T>(states[0]);

    return (<div className={className}>
        {states.map((st) => {
            const div = (<div
                className={`toggle-switch ${st.toString()}`}
                onClick={() => {
                    toggle((_:T) => {
                        onToggle(st);
                        return st;
                    });
                }}>
                <span className="toggle-text">{stateTexts.get(st)}</span>
                </div>);
            return activeState !== st && div;
        })}
        <span className="toggle-span"><div
                className={`toggle-switch ${activeState.toString()}`} style={{marginRight: '15px', marginLeft: '15px'}}>
                <span className="toggle-text">{stateTexts.get(activeState)}</span>
                </div>{label}</span>
    </div>);
}

export default ToggleMultiple;