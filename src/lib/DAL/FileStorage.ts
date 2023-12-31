import fs from "fs/promises"
import _path from "path"

interface IFileStorage {
	exists: (name: string, path: string) => Promise<boolean>
	delete: (name: string, path: string) => Promise<boolean>
	write: (name: string, path: string, file: File) => Promise<boolean>
}

type FileStorages = LocalPublicFileStorage

class LocalPublicFileStorage implements IFileStorage {
	private async validatePath(path: string) {
		return (await fs.lstat(path))?.isDirectory() ? true : false
	}
	private resolve(name: string, path: string) {
		return _path.resolve(_path.join(path, name))
	}

	public async exists(name: string, path: string) {
		const fullName = _path.join(path, name)
		if (!(await fs.lstat(fullName))) return false
		return true
	}
	public async write(name: string, path: string, file: File) {
		if (!(await this.validatePath(path))) return false
		const fullName = this.resolve(name, path)
		if (!fs.lstat(fullName)) return false
		try {
			await fs.writeFile(fullName, Buffer.from(await file.arrayBuffer()))
			return true
		} catch {
			return false
		}
	}
	public async delete(name: string, path: string) {
		if (!(await this.validatePath(path))) return true
		const fullName = this.resolve(name, path)
		if (!fs.lstat(fullName)) return true
		try {
			await fs.rm(fullName)
			return true
		} catch {
			return false
		}
	}
}

export const FileStorage: FileStorages = new LocalPublicFileStorage()
