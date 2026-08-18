import { NextRequest } from 'next/server';
import { apiSuccess } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  return apiSuccess({ message: 'Task endpoint placeholder' });
}
