// Manual mock for child_process to support ESM
import { jest } from '@jest/globals';
import { EventEmitter } from 'events';

let _mockSpawn = null;

export function __setMockSpawn(mock) {
  _mockSpawn = mock;
}

export function spawn(...args) {
  if (_mockSpawn) {
    return _mockSpawn(...args);
  }
  // Return a dummy EventEmitter if no mock is set
  // This prevents ENOENT errors when spawn is called before mock is set up
  const dummyProcess = new EventEmitter();
  dummyProcess.stdout = new EventEmitter();
  dummyProcess.stderr = new EventEmitter();
  dummyProcess.stdin = {
    write: () => {},
    end: () => {},
  };
  // Emit empty output and exit after a tick to simulate quick process completion
  setTimeout(() => {
    dummyProcess.stdout.emit('data', Buffer.from(''));
    dummyProcess.stdout.emit('end');
    dummyProcess.emit('exit', 0);
    dummyProcess.emit('close', 0);
  }, 0);
  return dummyProcess;
}

// Export other child_process functions individually to avoid conflicts
export { exec, execFile, fork, execSync, execFileSync, spawnSync } from 'child_process';
