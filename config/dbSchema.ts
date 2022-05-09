interface DbSchema {
	tableName: string;
	columnNames: DbColumnNames;
}

interface DbColumnNames {
	firstName: string;
	surname: string;
	dateOfBirth: string;
	timeAdded: string;
	message: string;
	editCount: string;
	lastEdit: string;
	editUser: string;
}

export interface DbColumnTypes {
	firstName: string;
	surname: string;
	dateOfBirth: number;
	timeAdded: Date;
	message: string;
	editCount: number;
	lastEdit: Date;
	editUser: string;
}

export const dbSchema: DbSchema = {
	tableName: 'messages',
	columnNames: {
		firstName: 'firstName',
		surname: 'surname',
		dateOfBirth: 'birthday',
		timeAdded: 'timeAdded',
		message: 'message',
		editCount: 'editCount',
		lastEdit: 'lastEdit',
		editUser: 'editUser',
	},
};

export default dbSchema;
