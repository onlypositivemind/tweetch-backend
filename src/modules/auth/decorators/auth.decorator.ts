import { applyDecorators, UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '../guards'

export const Authorization = () => applyDecorators(UseGuards(GqlAuthGuard))
