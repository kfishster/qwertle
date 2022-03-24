/* eslint-disable react/jsx-no-comment-textnodes */
import {
	CogIcon,
	QuestionMarkCircleIcon,
	ChartBarIcon,
	RefreshIcon,
} from "@heroicons/react/outline";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import { getSubtitle } from "./models/AppState";

type Props = {
	gameFinished: boolean;
	cluesEnabled: number;
	practice: boolean;
	openAbout: () => void;
	openResults: () => void;
	openSettings: () => void;
	togglePractice: () => void;
	refreshPractice: () => void;
	finishedAnimation: () => void;
};

export const Toolbar = ({
	gameFinished,
	cluesEnabled,
	practice,
	togglePractice,
	openAbout,
	openResults,
	openSettings,
	refreshPractice,
	finishedAnimation,
}: Props) => {
	return (
		<div className="flex flex-col text-mainframe-green justify-between items-center w-full px-4">
			<div className="flex flex-row text-mainframe-green justify-between items-start w-full">
				<div className="flex basis-1/4 flex-row gap-2 justify-start">
					<button onClick={openAbout}>
						<QuestionMarkCircleIcon className="flex h-8 stroke-1" />
					</button>
					{gameFinished && (
						<button onClick={openResults}>
							<ChartBarIcon className={`flex h-8 stroke-1`} />
						</button>
					)}
				</div>
				<div
					className={`flex basis-1/2 justify-center flex-row gap-4 min-w-screen font-mono tracking-wider font-bold transition-all ease-out duration-700`}
					onAnimationEnd={finishedAnimation}
				>
					<div className="">
						<h1 className="text-2xl">/*</h1>
					</div>
					<div className="flex flex-col items-center">
						<h1 className="text-2xl">QWERTLE</h1>
						<p className="text-xs">{getSubtitle(cluesEnabled)}</p>
					</div>
					<div className="">
						<h1 className="text-2xl">*/</h1>
					</div>
				</div>
				<div className="flex basis-1/4 flex-row gap-2 justify-end">
					<button onClick={openSettings}>
						<CogIcon className="flex h-8 stroke-1 hover:animate-spin" />
					</button>
				</div>
			</div>
			<div className="flex flex-row my-4 gap-4">
				<div className="flex flex-col h-4 items-center">
					<Toggle
						aria-label="Practice"
						defaultChecked={practice}
						onChange={togglePractice}
						icons={false}
					/>
					{gameFinished && <RefreshIcon className="flex h-8 stroke-1" />}
					<p className="text-xs mt-1">{practice ? "practice" : "daily"}</p>
				</div>
				{practice && gameFinished && (
					<button>
						<RefreshIcon
							className="flex h-8 stroke-1 hover:animate-spin"
							onClick={refreshPractice}
						/>
					</button>
				)}
			</div>
		</div>
	);
};
