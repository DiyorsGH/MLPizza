import type { RefObject } from "react";
import { useCallback, useEffect } from "react";

type UseDialogOptions = {
	appear?: string;
	disappear?: string;
	duration?: number; // in ms
};

export default function useDialogAnim(
	dialogRef: RefObject<HTMLDialogElement | null>,
	onClose: () => void,
	{ appear, disappear, duration = 300 }: UseDialogOptions = {},
) {
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (appear) dialog.classList.add(appear);
		dialog.showModal();

		return () => {
			dialog.close();
			if (appear) dialog.classList.remove(appear);
			if (disappear) dialog.classList.remove(disappear);
		};
	}, [dialogRef, appear, disappear]);

	const closeDialog = useCallback(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (dialog.dataset.closing === "true") return; // prevent double close
		dialog.dataset.closing = "true";

		if (appear) dialog.classList.remove(appear);
		if (disappear) dialog.classList.add(disappear);

		setTimeout(() => {
			if (disappear) dialog.classList.remove(disappear);
			dialog.close();
			onClose();
			delete dialog.dataset.closing;
		}, duration);
	}, [dialogRef, onClose, appear, disappear, duration]);

	return closeDialog;
}
