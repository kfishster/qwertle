/* eslint-disable react/jsx-no-comment-textnodes */
import { GameSettings, GameStatus } from "../models/AppState";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import { Modal } from "./Modal";

type Props = {
	settings: GameSettings;
	status: GameStatus;
	toggleShowSubstrings: () => void;
	toggleKeyboardHeatmap: () => void;
	closeSettings: () => void;
};

type RowProps = {
	name: string;
	value: boolean;
	enabled: boolean;
	toggle: () => void;
};

export const SettingRow = ({ name, value, enabled, toggle }: RowProps) => {
	return (
		<div className="flex flex-row justify-between w-full px-8">
			<h2>{name}</h2>
			<Toggle
				disabled={!enabled}
				defaultChecked={value}
				onChange={toggle}
				icons={false}
			/>
		</div>
	);
};

export const Settings = ({
	status,
	settings,
	toggleShowSubstrings,
	toggleKeyboardHeatmap,
	closeSettings,
}: Props) => {
	const settingsEnabled = status !== GameStatus.PLAYING;
	return (
		<Modal close={closeSettings}>
			<div className="flex flex-col items-center gap-4 w-full">
				<h1 className="text-2xl pb-8">/* SETTINGS */</h1>
				{!settingsEnabled && (
					<p>wait until the game is finished to change the settings</p>
				)}
				<SettingRow
					name="Show substring clues"
					value={settings.showSubstrings}
					enabled={settingsEnabled}
					toggle={toggleShowSubstrings}
				/>
				<SettingRow
					name="Show keyboard heatmap"
					value={settings.showKeyboardHeatmap}
					enabled={settingsEnabled}
					toggle={toggleKeyboardHeatmap}
				/>
			</div>
		</Modal>
	);
};
