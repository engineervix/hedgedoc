/*
 * SPDX-FileCopyrightText: 2022 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import mockedEnv from 'mocked-env';

import { DefaultAccessPermission } from './default-access-permission.enum';
import noteConfig from './note.config';

describe('noteConfig', () => {
  const forbiddenNoteIds = ['forbidden_1', 'forbidden_2'];
  const forbiddenNoteId = 'single_forbidden_id';
  const invalidforbiddenNoteIds = ['', ''];
  const maxDocumentLength = 1234;
  const negativeMaxDocumentLength = -123;
  const floatMaxDocumentLength = 2.71;
  const invalidMaxDocumentLength = 'not-a-max-document-length';
  const everyoneMayCreateNote = true;
  const everyoneAccessAllowed = true;
  const wrongDefaultPermission = 'wrong';

  describe('correctly parses config', () => {
    it('when given correct and complete environment variables', () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteIds.join(' , '),
          HD_MAX_DOCUMENT_LENGTH: maxDocumentLength.toString(),
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          HD_EVERYONE_ACCESS_ALLOWED: String(everyoneAccessAllowed),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      const config = noteConfig();
      expect(config.forbiddenNoteIds).toHaveLength(forbiddenNoteIds.length);
      expect(config.forbiddenNoteIds).toEqual(forbiddenNoteIds);
      expect(config.maxDocumentLength).toEqual(maxDocumentLength);
      expect(config.permissions.accessDefault.everyone).toEqual(
        DefaultAccessPermission.READ,
      );
      expect(config.permissions.accessDefault.loggedIn).toEqual(
        DefaultAccessPermission.READ,
      );
      expect(config.permissions.everyoneCanCreateNotes).toEqual(
        everyoneMayCreateNote,
      );
      expect(config.everyoneAccessAllowed).toEqual(everyoneAccessAllowed);
      restore();
    });

    it('when no HD_FORBIDDEN_NOTE_IDS is set', () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_MAX_DOCUMENT_LENGTH: maxDocumentLength.toString(),
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          HD_EVERYONE_ACCESS_ALLOWED: String(everyoneAccessAllowed),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      const config = noteConfig();
      expect(config.forbiddenNoteIds).toHaveLength(0);
      expect(config.maxDocumentLength).toEqual(maxDocumentLength);
      expect(config.permissions.accessDefault.everyone).toEqual(
        DefaultAccessPermission.READ,
      );
      expect(config.permissions.accessDefault.loggedIn).toEqual(
        DefaultAccessPermission.READ,
      );
      expect(config.permissions.everyoneCanCreateNotes).toEqual(
        everyoneMayCreateNote,
      );
      expect(config.everyoneAccessAllowed).toEqual(everyoneAccessAllowed);
      restore();
    });

    it('when no HD_MAX_DOCUMENT_LENGTH is set', () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteIds.join(' , '),
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          HD_EVERYONE_ACCESS_ALLOWED: String(everyoneAccessAllowed),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      const config = noteConfig();
      expect(config.forbiddenNoteIds).toHaveLength(forbiddenNoteIds.length);
      expect(config.forbiddenNoteIds).toEqual(forbiddenNoteIds);
      expect(config.maxDocumentLength).toEqual(100000);
      expect(config.permissions.accessDefault.everyone).toEqual(
        DefaultAccessPermission.READ,
      );
      expect(config.permissions.accessDefault.loggedIn).toEqual(
        DefaultAccessPermission.READ,
      );
      expect(config.permissions.everyoneCanCreateNotes).toEqual(
        everyoneMayCreateNote,
      );
      expect(config.everyoneAccessAllowed).toEqual(everyoneAccessAllowed);
      restore();
    });

    it('when HD_FORBIDDEN_NOTE_IDS is a single item', () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteId,
          HD_MAX_DOCUMENT_LENGTH: maxDocumentLength.toString(),
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          HD_EVERYONE_ACCESS_ALLOWED: String(everyoneAccessAllowed),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      const config = noteConfig();
      expect(config.forbiddenNoteIds).toHaveLength(1);
      expect(config.forbiddenNoteIds[0]).toEqual(forbiddenNoteId);
      expect(config.maxDocumentLength).toEqual(maxDocumentLength);
      expect(config.permissions.accessDefault.everyone).toEqual(
        DefaultAccessPermission.READ,
      );
      expect(config.permissions.accessDefault.loggedIn).toEqual(
        DefaultAccessPermission.READ,
      );
      expect(config.permissions.everyoneCanCreateNotes).toEqual(
        everyoneMayCreateNote,
      );
      expect(config.everyoneAccessAllowed).toEqual(everyoneAccessAllowed);
      restore();
    });

    it('when no HD_PERMISSION_EVERYONE_DEFAULT_ACCESS is set', () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteIds.join(' , '),
          HD_MAX_DOCUMENT_LENGTH: maxDocumentLength.toString(),
          HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          HD_EVERYONE_ACCESS_ALLOWED: String(everyoneAccessAllowed),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      const config = noteConfig();
      expect(config.forbiddenNoteIds).toHaveLength(forbiddenNoteIds.length);
      expect(config.forbiddenNoteIds).toEqual(forbiddenNoteIds);
      expect(config.maxDocumentLength).toEqual(maxDocumentLength);
      expect(config.permissions.accessDefault.everyone).toEqual(
        DefaultAccessPermission.READ,
      );
      expect(config.permissions.accessDefault.loggedIn).toEqual(
        DefaultAccessPermission.READ,
      );
      expect(config.permissions.everyoneCanCreateNotes).toEqual(
        everyoneMayCreateNote,
      );
      expect(config.everyoneAccessAllowed).toEqual(everyoneAccessAllowed);
      restore();
    });

    it('when no HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS is set', () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteIds.join(' , '),
          HD_MAX_DOCUMENT_LENGTH: maxDocumentLength.toString(),
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          HD_EVERYONE_ACCESS_ALLOWED: String(everyoneAccessAllowed),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      const config = noteConfig();
      expect(config.forbiddenNoteIds).toHaveLength(forbiddenNoteIds.length);
      expect(config.forbiddenNoteIds).toEqual(forbiddenNoteIds);
      expect(config.maxDocumentLength).toEqual(maxDocumentLength);
      expect(config.permissions.accessDefault.everyone).toEqual(
        DefaultAccessPermission.READ,
      );
      expect(config.permissions.accessDefault.loggedIn).toEqual(
        DefaultAccessPermission.WRITE,
      );
      expect(config.permissions.everyoneCanCreateNotes).toEqual(
        everyoneMayCreateNote,
      );
      expect(config.everyoneAccessAllowed).toEqual(everyoneAccessAllowed);
      restore();
    });

    it('when no HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES is set', () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteIds.join(' , '),
          HD_MAX_DOCUMENT_LENGTH: maxDocumentLength.toString(),
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_EVERYONE_ACCESS_ALLOWED: String(everyoneAccessAllowed),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      const config = noteConfig();
      expect(config.forbiddenNoteIds).toHaveLength(forbiddenNoteIds.length);
      expect(config.forbiddenNoteIds).toEqual(forbiddenNoteIds);
      expect(config.maxDocumentLength).toEqual(maxDocumentLength);
      expect(config.permissions.accessDefault.everyone).toEqual(
        DefaultAccessPermission.READ,
      );
      expect(config.permissions.accessDefault.loggedIn).toEqual(
        DefaultAccessPermission.WRITE,
      );
      expect(config.permissions.everyoneCanCreateNotes).toEqual(false);
      expect(config.everyoneAccessAllowed).toEqual(everyoneAccessAllowed);
      restore();
    });

    it('when no HD_EVERYONE_ACCESS_ALLOWED is set', () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteIds.join(' , '),
          HD_MAX_DOCUMENT_LENGTH: maxDocumentLength.toString(),
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      const config = noteConfig();
      expect(config.forbiddenNoteIds).toHaveLength(forbiddenNoteIds.length);
      expect(config.forbiddenNoteIds).toEqual(forbiddenNoteIds);
      expect(config.maxDocumentLength).toEqual(maxDocumentLength);
      expect(config.permissions.accessDefault.everyone).toEqual(
        DefaultAccessPermission.READ,
      );
      expect(config.permissions.accessDefault.loggedIn).toEqual(
        DefaultAccessPermission.WRITE,
      );
      expect(config.permissions.everyoneCanCreateNotes).toEqual(
        everyoneMayCreateNote,
      );
      expect(config.everyoneAccessAllowed).toEqual(true);
      restore();
    });
  });

  describe('throws error', () => {
    it('when given a non-valid HD_FORBIDDEN_NOTE_IDS', async () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: invalidforbiddenNoteIds.join(' , '),
          HD_MAX_DOCUMENT_LENGTH: maxDocumentLength.toString(),
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          HD_EVERYONE_ACCESS_ALLOWED: String(everyoneAccessAllowed),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      expect(() => noteConfig()).toThrow(
        '"forbiddenNoteIds[0]" is not allowed to be empty',
      );
      restore();
    });

    it('when given a negative HD_MAX_DOCUMENT_LENGTH', async () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteIds.join(' , '),
          HD_MAX_DOCUMENT_LENGTH: negativeMaxDocumentLength.toString(),
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          HD_EVERYONE_ACCESS_ALLOWED: String(everyoneAccessAllowed),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      expect(() => noteConfig()).toThrow(
        '"HD_MAX_DOCUMENT_LENGTH" must be a positive number',
      );
      restore();
    });

    it('when given a non-integer HD_MAX_DOCUMENT_LENGTH', async () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteIds.join(' , '),
          HD_MAX_DOCUMENT_LENGTH: floatMaxDocumentLength.toString(),
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          HD_EVERYONE_ACCESS_ALLOWED: String(everyoneAccessAllowed),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      expect(() => noteConfig()).toThrow(
        '"HD_MAX_DOCUMENT_LENGTH" must be an integer',
      );
      restore();
    });

    it('when given a non-number HD_MAX_DOCUMENT_LENGTH', async () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteIds.join(' , '),
          HD_MAX_DOCUMENT_LENGTH: invalidMaxDocumentLength,
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          HD_EVERYONE_ACCESS_ALLOWED: String(everyoneAccessAllowed),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      expect(() => noteConfig()).toThrow(
        '"HD_MAX_DOCUMENT_LENGTH" must be a number',
      );
      restore();
    });

    it('when given a non-valid HD_PERMISSION_EVERYONE_DEFAULT_ACCESS', async () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteIds.join(' , '),
          HD_MAX_DOCUMENT_LENGTH: maxDocumentLength.toString(),
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: wrongDefaultPermission,
          HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          HD_EVERYONE_ACCESS_ALLOWED: String(everyoneAccessAllowed),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      expect(() => noteConfig()).toThrow(
        '"HD_PERMISSION_EVERYONE_DEFAULT_ACCESS" must be one of [none, read, write]',
      );
      restore();
    });

    it('when given a non-valid HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS', async () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteIds.join(' , '),
          HD_MAX_DOCUMENT_LENGTH: maxDocumentLength.toString(),
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: wrongDefaultPermission,
          HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS: wrongDefaultPermission,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          HD_EVERYONE_ACCESS_ALLOWED: String(everyoneAccessAllowed),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      expect(() => noteConfig()).toThrow(
        '"HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS" must be one of [none, read, write]',
      );
      restore();
    });

    it('when HD_EVERYONE_ACCESS_ALLOWED is set to false and HD_PERMISSION_EVERYONE_DEFAULT_ACCESS is set', async () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteIds.join(' , '),
          HD_MAX_DOCUMENT_LENGTH: maxDocumentLength.toString(),
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_EVERYONE_ACCESS_ALLOWED: 'false',
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      expect(() => noteConfig()).toThrow(
        `'HD_EVERYONE_ACCESS_ALLOWED' is set to 'false', but 'HD_PERMISSION_EVERYONE_DEFAULT_ACCESS' is also configured. Please remove 'HD_PERMISSION_EVERYONE_DEFAULT_ACCESS'.`,
      );
      restore();
    });

    it('when HD_EVERYONE_ACCESS_ALLOWED is set to false and HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES is set', async () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteIds.join(' , '),
          HD_MAX_DOCUMENT_LENGTH: maxDocumentLength.toString(),
          HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          HD_EVERYONE_ACCESS_ALLOWED: 'false',
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      expect(() => noteConfig()).toThrow(
        `'HD_EVERYONE_ACCESS_ALLOWED' is set to 'false', but 'HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES' is also configured. Please remove 'HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES'.`,
      );
      restore();
    });

    it('when HD_EVERYONE_ACCESS_ALLOWED is set to false and HD_PERMISSION_EVERYONE_DEFAULT_ACCESS and HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES are set', async () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteIds.join(' , '),
          HD_MAX_DOCUMENT_LENGTH: maxDocumentLength.toString(),
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          HD_EVERYONE_ACCESS_ALLOWED: 'false',
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      expect(() => noteConfig()).toThrow(
        `'HD_EVERYONE_ACCESS_ALLOWED' is set to 'false', but 'HD_PERMISSION_EVERYONE_DEFAULT_ACCESS' is also configured. Please remove 'HD_PERMISSION_EVERYONE_DEFAULT_ACCESS'.`,
      );
      restore();
    });

    it('when HD_PERMISSION_EVERYONE_DEFAULT_ACCESS is set to write, but HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS is set to read', async () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteIds.join(' , '),
          HD_MAX_DOCUMENT_LENGTH: maxDocumentLength.toString(),
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: DefaultAccessPermission.WRITE,
          HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          HD_EVERYONE_ACCESS_ALLOWED: String(everyoneAccessAllowed),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      expect(() => noteConfig()).toThrow(
        `'HD_PERMISSION_EVERYONE_DEFAULT_ACCESS' is set to '${DefaultAccessPermission.WRITE}', but 'HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS' is set to '${DefaultAccessPermission.READ}'. This gives everyone greater permissions than logged-in users which is not allowed.`,
      );
      restore();
    });

    it('when HD_PERMISSION_EVERYONE_DEFAULT_ACCESS is set to write, but HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS is set to none', async () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteIds.join(' , '),
          HD_MAX_DOCUMENT_LENGTH: maxDocumentLength.toString(),
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: DefaultAccessPermission.WRITE,
          HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS: DefaultAccessPermission.NONE,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          HD_EVERYONE_ACCESS_ALLOWED: String(everyoneAccessAllowed),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      expect(() => noteConfig()).toThrow(
        `'HD_PERMISSION_EVERYONE_DEFAULT_ACCESS' is set to '${DefaultAccessPermission.WRITE}', but 'HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS' is set to '${DefaultAccessPermission.NONE}'. This gives everyone greater permissions than logged-in users which is not allowed.`,
      );
      restore();
    });

    it('when HD_PERMISSION_EVERYONE_DEFAULT_ACCESS is set to read, but HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS is set to none', async () => {
      const restore = mockedEnv(
        {
          /* eslint-disable @typescript-eslint/naming-convention */
          HD_FORBIDDEN_NOTE_IDS: forbiddenNoteIds.join(' , '),
          HD_MAX_DOCUMENT_LENGTH: maxDocumentLength.toString(),
          HD_PERMISSION_EVERYONE_DEFAULT_ACCESS: DefaultAccessPermission.READ,
          HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS: DefaultAccessPermission.NONE,
          HD_PERMISSION_EVERYONE_CAN_CREATE_NOTES: String(
            everyoneMayCreateNote,
          ),
          HD_EVERYONE_ACCESS_ALLOWED: String(everyoneAccessAllowed),
          /* eslint-enable @typescript-eslint/naming-convention */
        },
        {
          clear: true,
        },
      );
      expect(() => noteConfig()).toThrow(
        `'HD_PERMISSION_EVERYONE_DEFAULT_ACCESS' is set to '${DefaultAccessPermission.READ}', but 'HD_PERMISSION_LOGGED_IN_DEFAULT_ACCESS' is set to '${DefaultAccessPermission.NONE}'. This gives everyone greater permissions than logged-in users which is not allowed.`,
      );
      restore();
    });
  });
});
