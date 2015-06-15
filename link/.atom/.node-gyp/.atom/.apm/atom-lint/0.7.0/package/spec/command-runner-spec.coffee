CommandRunner = require '../lib/command-runner'

describe 'CommandRunner', ->
  originalPath = process.env.PATH
  originalShell = process.env.SHELL

  afterEach ->
    process.env.PATH = originalPath
    process.env.SHELL = originalShell

  describe '.fetchEnvOfLoginShell', ->
    itPassesAnObjectContainingAllEnvironementVariables = ->
      it 'passes an object containing all environement variables', ->
        hasFetched = false

        CommandRunner.fetchEnvOfLoginShell (error, env) ->
          expect(error).toBeFalsy()
          expect(env.PATH.constructor).toBe(String)
          expect(env.PATH).toMatch(/\/[^:]+(?::\/[^:]+)/)
          expect(env.HOME).toBe(process.env.HOME)
          hasFetched = true

        waitsFor ->
          hasFetched

    describe 'when the login shell is bash', ->
      beforeEach ->
        process.env.SHELL = '/bin/bash'

      itPassesAnObjectContainingAllEnvironementVariables()

    describe 'when the login shell is zsh', ->
      beforeEach ->
        process.env.SHELL = '/bin/zsh'

      itPassesAnObjectContainingAllEnvironementVariables()

    describe 'when the login shell is tcsh', ->
      beforeEach ->
        process.env.SHELL = '/bin/tcsh'

      it 'passes error', ->
        hasFetched = false

        CommandRunner.fetchEnvOfLoginShell (error, env) ->
          expect(error.message).toMatch(/tcsh.+not.+supported/)
          expect(env).toBeFalsy()
          hasFetched = true

        waitsFor ->
          hasFetched

    describe 'when SHELL enviroment variable is not set', ->
      beforeEach ->
        process.env.SHELL = ''

      it 'passes error', ->
        hasFetched = false

        CommandRunner.fetchEnvOfLoginShell (error, env) ->
          expect(error.message).toMatch(/SHELL.+not.+set/)
          expect(env).toBeFalsy()
          hasFetched = true

        waitsFor ->
          hasFetched

  describe 'getEnvOfLoginShell', ->
    beforeEach ->
      CommandRunner._cachedEnvOfLoginShell = undefined

    describe 'on first invocation', ->
      it 'invokes .fetchEnvOfLoginShell and passes the result', ->
        spyOn(CommandRunner, 'fetchEnvOfLoginShell').andCallThrough()

        hasGotten = false

        CommandRunner.getEnvOfLoginShell (env) ->
          expect(env.PATH).toMatch(/\/[^:]+(?::\/[^:]+)/)
          expect(CommandRunner.fetchEnvOfLoginShell).toHaveBeenCalled()
          hasGotten = true

        waitsFor ->
          hasGotten

    describe 'on second invocation', ->
      itReturnsCachedResultOfFetchEnvOfLoginShell = ->
        it 'returns cached result of .fetchEnvOfLoginShell', ->
          hasGotten = false

          CommandRunner.getEnvOfLoginShell (env) ->
            hasGotten = true

          waitsFor ->
            hasGotten

          runs ->
            hasGotten = false
            spyOn(CommandRunner, 'fetchEnvOfLoginShell').andCallThrough()

            CommandRunner.getEnvOfLoginShell (env) ->
              expect(CommandRunner.fetchEnvOfLoginShell).not.toHaveBeenCalled()
              hasGotten = true

          waitsFor ->
            hasGotten

      describe 'and the result of .fetchEnvOfLoginShell is valid', ->
        itReturnsCachedResultOfFetchEnvOfLoginShell()

      describe 'and the result of fetchEnvOfLoginShell is null', ->
        beforeEach ->
          process.env.SHELL = ''

        itReturnsCachedResultOfFetchEnvOfLoginShell()

  describe 'run', ->
    beforeEach ->
      CommandRunner._cachedEnvOfLoginShell = undefined

    run = (command, callback) ->
      hasRun = false

      runner = new CommandRunner(command)
      runner.run (error, result) ->
        callback(error, result)
        hasRun = true

      waitsFor ->
        hasRun

    it 'handles arguments include whitespaces', ->
      run ['echo', '-n', 'foo   bar'], (error, result) ->
        expect(result.stdout).toBe('foo   bar')

    describe 'when the command run successfully', ->
      it 'passes stdout', ->
        run ['echo', '-n', 'foo'], (error, result) ->
          expect(result.stdout).toBe('foo')

      it 'passes stderr', ->
        run ['ls', 'non-existent-file'], (error, result) ->
          expect(result.stderr).toMatch(/no such file/i)

      it 'passes exit code', ->
        run ['ls', '/'], (error, result) ->
          expect(result.exitCode).toBe(0)
        run ['ls', 'non-existent-file'], (error, result) ->
          expect(result.exitCode).toBe(1)

      it 'passes no error', ->
        run ['ls', '/'], (error, result) ->
          expect(result.error).toBeFalsy()

    describe 'when the command is not found', ->
      it 'invokes the callback only once', ->
        invocationCount = 0

        runner = new CommandRunner(['non-existent-command'])
        runner.run (error, result) ->
          invocationCount++

        waits(500)

        runs ->
          expect(invocationCount).toBe(1)

      it 'passes empty stdout', ->
        run ['non-existent-command'], (error, result) ->
          expect(result.stdout).toBe('')

      it 'passes empty stderr', ->
        run ['non-existent-command'], (error, result) ->
          expect(result.stderr).toBe('')

      it 'passes undefined exit code', ->
        run ['non-existent-command'], (error, result) ->
          expect(result.exitCode).toBeUndefined()

      it 'passes ENOENT error', ->
        run ['non-existent-command'], (error, result) ->
          expect(error.code).toBe('ENOENT')

    describe 'when the command is specified as an absolute path', ->
      it 'runs the command with the current PATH', ->
        run ['/usr/bin/perl', '-e', 'print $ENV{PATH}'], (error, result) ->
          expect(result.stdout).toBe(process.env.PATH)

    describe 'when the command is specified as a basename', ->
      describe 'and PATH of the login shell can be fetched', ->
        it 'runs the command with PATH of the login shell', ->
          process.env.PATH = '/usr/bin'
          run ['perl', '-e', 'print $ENV{PATH}'], (error, result) ->
            expect(result.stdout).not.toBe('/usr/bin')

        it 'does not modify PATH of the current process', ->
          process.env.PATH = '/usr/bin'
          run ['perl', '-e', 'print $ENV{PATH}'], (error, result) ->
            expect(process.env.PATH).toBe('/usr/bin')

      describe 'and PATH of the login shell cannot be fetched', ->
        it 'runs the command with the current PATH', ->
          process.env.SHELL = ''
          run ['perl', '-e', 'print $ENV{PATH}'], (error, result) ->
            expect(result.stdout).toBe(process.env.PATH)
