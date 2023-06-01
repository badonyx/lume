import { MentionNote } from "@app/note/components/mentions/note";
import { MentionUser } from "@app/note/components/mentions/user";
import { ImagePreview } from "@app/note/components/preview/image";
import { VideoPreview } from "@app/note/components/preview/video";
import { truncateContent } from "@utils/transform";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Kind1({
	content,
	truncate = false,
}: { content: any; truncate?: boolean }) {
	return (
		<>
			<ReactMarkdown
				remarkPlugins={[[remarkGfm]]}
				linkTarget="_blank"
				className="markdown"
				components={{
					em: ({ ...props }) => <MentionUser {...props} />,
				}}
			>
				{truncate ? truncateContent(content.parsed, 120) : content.parsed}
			</ReactMarkdown>
			{Array.isArray(content.images) && content.images.length ? (
				<ImagePreview urls={content.images} />
			) : (
				<></>
			)}
			{Array.isArray(content.videos) && content.videos.length ? (
				<VideoPreview urls={content.videos} />
			) : (
				<></>
			)}
			{Array.isArray(content.notes) && content.notes.length ? (
				content.notes.map((note: string) => (
					<MentionNote key={note} id={note} />
				))
			) : (
				<></>
			)}
		</>
	);
}
