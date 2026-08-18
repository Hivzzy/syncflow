import React from 'react';

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-white">Board: {id}</h1>
    </div>
  );
}
