
const AWS = require('aws-sdk');

const glue = new AWS.Glue({ apiVersion: '2017-03-31' });
let StorageDescriptor: any = {};


const makePartition = async (labels:{name:string,value:any}[]) => {
  labels.forEach(label => {
    if(String(label.value).length === 0){
      throw new TypeError('Label must be a stringable with at least 1 character')
    }
  })
  let partitionLocation = labels.map(label => `${label.name}=${label.value}`).join('/')
  let Values = labels.map(label => String(label.value)) 
  let SDKey = Values.join('-');
  console.log('makePartition', Values);
  try {
    console.log('makePartition1');
    let result = await glue
      .getPartition({
        DatabaseName: process.env.DATABASE_NAME,
        TableName: process.env.TABLE_NAME,
        PartitionValues: Values,
      })
      .promise();
    console.log('Partition exists', JSON.stringify(result));
  } catch (e) {
    console.log('actual error partition', e);
    // Got something useful, get the current table data or use cache if already done
    if (!StorageDescriptor[SDKey]) {
      let { Table } = await glue
        .getTable({
          DatabaseName: process.env.DATABASE_NAME,
          Name: process.env.TABLE_NAME,
        })
        .promise();
      StorageDescriptor[SDKey] = Table.StorageDescriptor;
    }
    // exception... need a new partition
    if (e.code === 'EntityNotFoundException') {
      let tableLocation = StorageDescriptor[SDKey].Location;
      let Location = `${tableLocation}${tableLocation.charAt(tableLocation.length - 1) !== '/' ? '/' : ''}${partitionLocation}/`;

      let params = {
        DatabaseName: process.env.DATABASE_NAME,
        TableName: process.env.TABLE_NAME,
        PartitionInput: {
          StorageDescriptor: {
            ...StorageDescriptor[SDKey],
            Location,
          },
          Values,
        },
      };
      console.log('Creating new partition', Values);
      let result = await glue.createPartition(params).promise();
      console.log('makePartition result', result);
    } else {
      console.error('Other error', Values, e.code, e);
      throw e.code;
    }
  }
};
