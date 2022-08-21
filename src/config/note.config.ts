/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import {
  DefaultAccessPermission,
  getDefaultAccessPermissionOrdinal,
} from './default-access-permission.enum';
import { buildErrorMessage, parseOptionalNumber, toArrayConfig } from './utils';

export interface NoteConfig {
  forbiddenNoteIds: string[];
  maxDocumentLength: number;
  permissions: {
    accessDefault: {
      everyone: DefaultAccessPermission;
      loggedIn: DefaultAccessPermission;
    };
  };
}

const schema = Joi.object<NoteConfig>({
  forbiddenNoteIds: Joi.array()
    .items(Joi.string())
    .optional()
    .default([])
    .label('HD_FORBIDDEN_NOTE_IDS'),
  maxDocumentLength: Joi.number()
    .default(100000)
    .positive()
    .integer()
    .optional()
    .label('HD_MAX_DOCUMENT_LENGTH'),
  permissions: {
    accessDefault: {
      everyone: Joi.string()
        .valid(...Object.values(DefaultAccessPermission))
        .optional()
        .default(DefaultAccessPermission.READ)
        .label('HD_PERMISSION_EVERYONE_DEFAULT_ACCESS'),
      loggedIn: Joi.string()
        .valid(...Object.values(DefaultAccessPermission))
        .optional()
        .default(DefaultAccessPermission.WRITE)
        .label('HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS'),
    },
  },
});

function checkLoggedInUsersHaveHigherDefaultPermissionsThanGuests(
  config: NoteConfig,
): void {
  const everyone = config.permissions.accessDefault.everyone;
  const loggedIn = config.permissions.accessDefault.loggedIn;
  if (
    getDefaultAccessPermissionOrdinal(everyone) >
    getDefaultAccessPermissionOrdinal(loggedIn)
  ) {
    throw new Error(
      `'HD_PERMISSION_EVERYONE_DEFAULT_ACCESS' is set to '${everyone}', but 'HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS' is set to '${loggedIn}'. This gives everyone greater permissions than logged-in users which is not allowed.`,
    );
  }
}

export default registerAs('noteConfig', () => {
  const noteConfig = schema.validate(
    {
      forbiddenNoteIds: toArrayConfig(process.env.HD_FORBIDDEN_NOTE_IDS, ','),
      maxDocumentLength: parseOptionalNumber(
        process.env.HD_MAX_DOCUMENT_LENGTH,
      ),
      permissions: {
        accessDefault: {
          everyone: process.env.HD_PERMISSION_EVERYONE_DEFAULT_ACCESS,
          loggedIn: process.env.HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS,
        },
      },
    } as NoteConfig,
    {
      abortEarly: false,
      presence: 'required',
    },
  );
  if (noteConfig.error) {
    const errorMessages = noteConfig.error.details.map(
      (detail) => detail.message,
    );
    throw new Error(buildErrorMessage(errorMessages));
  }
  const config = noteConfig.value;
  checkLoggedInUsersHaveHigherDefaultPermissionsThanGuests(config);
  return config;
});
