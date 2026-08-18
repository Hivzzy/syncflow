import { NextRequest } from 'next/server';
import { apiSuccess } from '@/lib/api-response';

export async function PATCH(req: NextRequest) {
  return apiSuccess({ message: 'Task move placeholder' });
}
