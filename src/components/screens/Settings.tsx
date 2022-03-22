/* eslint-disable react/jsx-no-comment-textnodes */
import { GameSettings } from "../models/AppState";
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import { Modal } from "./Modal";

type Props = {
    settings: GameSettings;
    toggleShowSubstrings: () => void;
    toggleKeyboardHeatmap: () => void;
    closeSettings: () => void;
};

type RowProps = {
    name: string;
    value: boolean;
    toggle: () => void;
};

export const SettingRow = ({ name, value, toggle }: RowProps) => {
    return (
        <div className="flex flex-row justify-between w-full px-8">
            <h2>{name}</h2>
            <Toggle defaultChecked={value} onChange={toggle} icons={false}/>
        </div>
    );
};

export const Settings = ({ settings, toggleShowSubstrings, toggleKeyboardHeatmap, closeSettings }: Props) => {
    return (
        <Modal close={closeSettings}>
            <div className="flex flex-col items-center gap-2 w-full">
                <h1 className="text-2xl pb-8">/* SETTINGS */</h1>
                <SettingRow name="Show substring clues" value={settings.showSubstrings} toggle={toggleShowSubstrings} />
                <SettingRow name="Show keyboard heatmap" value={settings.showKeyboardHeatmap} toggle={toggleKeyboardHeatmap} />
            </div>
        </Modal>
    );
};