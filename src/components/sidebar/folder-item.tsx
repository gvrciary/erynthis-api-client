import {
	Check,
	ChevronDown,
	ChevronRight,
	Edit2,
	Folder,
	Trash2,
	X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
	FolderItem as FolderItemType,
	RequestItem as RequestItemType,
} from "@/types/data";
import { cn } from "@/utils";
import RequestItem from "./request-item";

interface FolderItemProps {
	folder: FolderItemType;
	requests: RequestItemType[];
	activeRequestId: string | null;
	draggedItem: { type: "request" | "folder"; id: string } | null;
	dragOverItem: string | null;
	onToggle: (folderId: string) => void;
	onEdit: (folderId: string, newName: string) => void;
	onDelete: (folderId: string) => void;
	onSelectRequest: (requestId: string) => void;
	onDeleteRequest: (requestId: string) => void;
	onDragStart: (
		e: React.DragEvent,
		type: "request" | "folder",
		id: string,
	) => void;
	onDragEnd: (e: React.DragEvent) => void;
	onDragOver: (e: React.DragEvent, targetId: string) => void;
	onDragLeave: (e: React.DragEvent) => void;
	onDrop: (e: React.DragEvent, targetFolderId: string) => void;
}

const FolderItem = ({
	folder,
	requests,
	activeRequestId,
	draggedItem,
	dragOverItem,
	onToggle,
	onEdit,
	onDelete,
	onSelectRequest,
	onDeleteRequest,
	onDragStart,
	onDragEnd,
	onDragOver,
	onDragLeave,
	onDrop,
}: FolderItemProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editingName, setEditingName] = useState("");
	const editInputRef = useRef<HTMLInputElement>(null);

	const folderRequests = requests.filter((req) =>
		folder.requests.includes(req.id),
	);

	useEffect(() => {
		if (isEditing && editInputRef.current) {
			editInputRef.current.focus();
			editInputRef.current.select();
		}
	}, [isEditing]);

	const handleToggle = useCallback(() => {
		if (!isEditing) {
			onToggle(folder.id);
		}
	}, [onToggle, folder.id, isEditing]);

	const handleStartEdit = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			setIsEditing(true);
			setEditingName(folder.name);
		},
		[folder.name],
	);

	const handleSaveEdit = useCallback(() => {
		const trimmedName = editingName.trim();
		if (trimmedName && trimmedName !== folder.name) {
			onEdit(folder.id, trimmedName);
		}
		setIsEditing(false);
		setEditingName("");
	}, [editingName, folder.name, folder.id, onEdit]);

	const handleCancelEdit = useCallback(() => {
		setIsEditing(false);
		setEditingName("");
	}, []);

	const handleEditKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				handleSaveEdit();
			} else if (e.key === "Escape") {
				handleCancelEdit();
			}
		},
		[handleSaveEdit, handleCancelEdit],
	);

	const handleDelete = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			onDelete(folder.id);
		},
		[onDelete, folder.id],
	);

	const handleDragOver = useCallback(
		(e: React.DragEvent) => {
			onDragOver(e, folder.id);
		},
		[onDragOver, folder.id],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			onDrop(e, folder.id);
		},
		[onDrop, folder.id],
	);

	const handleEditInputClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
	}, []);

	const handleEditBlur = useCallback(() => {
		handleSaveEdit();
	}, [handleSaveEdit]);

	return (
		<div className="mb-2">
			<div
				className={cn(
					"group flex items-center space-x-2 p-2 rounded-lg hover:bg-muted cursor-pointer transition-all duration-150",
					dragOverItem === folder.id &&
						"bg-accent border-2 border-primary border-dashed",
				)}
				onClick={handleToggle}
				onDragOver={handleDragOver}
				onDragLeave={onDragLeave}
				onDrop={handleDrop}
				role="button"
				tabIndex={0}
				aria-label={`${folder.expanded ? "Collapse" : "Expand"} folder: ${folder.name}`}
				aria-expanded={folder.expanded}
			>
				<button
					type="button"
					className="p-1 hover:bg-accent rounded transition-colors duration-150"
					onClick={(e) => {
						e.stopPropagation();
						if (!isEditing) {
							onToggle(folder.id);
						}
					}}
					aria-label={`${folder.expanded ? "Collapse" : "Expand"} folder`}
				>
					{folder.expanded ? (
						<ChevronDown className="h-3 w-3 transition-transform duration-150" />
					) : (
						<ChevronRight className="h-3 w-3 transition-transform duration-150" />
					)}
				</button>

				<Folder className="h-4 w-4 text-muted-foreground flex-shrink-0" />

				{isEditing ? (
					<div className="flex items-center space-x-2 flex-1">
						<input
							ref={editInputRef}
							type="text"
							value={editingName}
							onChange={(e) => setEditingName(e.target.value)}
							onKeyDown={handleEditKeyDown}
							onBlur={handleEditBlur}
							onClick={handleEditInputClick}
							className="flex-1 text-sm font-medium bg-transparent border-b border-border focus:border-primary outline-none transition-colors duration-150"
							aria-label="Edit folder name"
						/>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								handleSaveEdit();
							}}
							className="p-1 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors duration-150"
							title="Save changes"
							aria-label="Save folder name"
						>
							<Check className="h-3 w-3" />
						</button>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								handleCancelEdit();
							}}
							className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150"
							title="Cancel editing"
							aria-label="Cancel editing"
						>
							<X className="h-3 w-3" />
						</button>
					</div>
				) : (
					<>
						<span
							className="text-sm font-medium flex-1 truncate"
							title={folder.name}
						>
							{folder.name}
						</span>
						<span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
							{folder.requests.length}
						</span>

						<button
							type="button"
							onClick={handleStartEdit}
							className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-150"
							title="Edit folder name"
							aria-label="Edit folder name"
						>
							<Edit2 className="h-3 w-3" />
						</button>
						<button
							type="button"
							onClick={handleDelete}
							className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-all duration-150"
							title="Delete folder"
							aria-label="Delete folder"
						>
							<Trash2 className="h-3 w-3" />
						</button>
					</>
				)}
			</div>

			{folder.expanded && folderRequests.length > 0 && (
				<div className="ml-6 space-y-1 mt-1">
					{folderRequests.map((request) => (
						<RequestItem
							key={request.id}
							request={request}
							isActive={activeRequestId === request.id}
							isDragged={draggedItem?.id === request.id}
							onSelect={onSelectRequest}
							onDelete={onDeleteRequest}
							onDragStart={onDragStart}
							onDragEnd={onDragEnd}
						/>
					))}
				</div>
			)}

			{folder.expanded && folderRequests.length === 0 && (
				<div className="ml-6 mt-1 p-4 text-center text-muted-foreground text-sm">
					<p>No requests in this folder</p>
					<p className="text-xs mt-1">Drag requests here to organize them</p>
				</div>
			)}
		</div>
	);
};

export default FolderItem;
