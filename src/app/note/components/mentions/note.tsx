import { Kind1 } from "@app/note/components/kind1";
import { Kind1063 } from "@app/note/components/kind1063";
import { NoteSkeleton } from "@app/note/components/skeleton";
import { NoteQuoteUser } from "@app/note/components/user/quote";
import { NoteWrapper } from "@app/note/components/wrapper";
import { RelayContext } from "@shared/relayProvider";
import { READONLY_RELAYS } from "@stores/constants";
import { noteParser } from "@utils/parser";
import { memo, useContext } from "react";
import useSWRSubscription from "swr/subscription";

export const MentionNote = memo(function MentionNote({ id }: { id: string }) {
	const pool: any = useContext(RelayContext);

	const { data, error } = useSWRSubscription(
		id ? id : null,
		(key, { next }) => {
			const unsubscribe = pool.subscribe(
				[
					{
						ids: [key],
					},
				],
				READONLY_RELAYS,
				(event: any) => {
					next(null, event);
				},
				undefined,
				undefined,
				{
					unsubscribeOnEose: true,
				},
			);

			return () => {
				unsubscribe();
			};
		},
	);

	const kind1 = !error && data?.kind === 1 ? noteParser(data) : null;
	const kind1063 = !error && data?.kind === 1063 ? data.tags : null;

	return (
		<NoteWrapper
			href={`/app/note?id=${id}`}
			className="mt-3 rounded-lg border border-zinc-800 px-3 pt-3"
		>
			{data ? (
				<>
					<NoteQuoteUser pubkey={data.pubkey} time={data.created_at} />
					<div className="mt-2">
						{kind1 && <Kind1 content={kind1} truncate={true} />}
						{kind1063 && <Kind1063 metadata={kind1063} />}
					</div>
				</>
			) : (
				<NoteSkeleton />
			)}
		</NoteWrapper>
	);
});
