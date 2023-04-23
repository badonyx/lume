import NewsfeedLayout from '@components/layouts/newsfeed';

export function Page() {
  return (
    <NewsfeedLayout>
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-sm text-zinc-400">Sorry, this feature under development, it will come in the next version</p>
      </div>
    </NewsfeedLayout>
  );
}
