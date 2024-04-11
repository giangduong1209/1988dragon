import { Button, Col, Form, Grid, Input, Row, Select, Typography, Spin } from 'antd';
import React, { useState } from 'react';
import styles from './CreateNFT.module.css';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { ethers, Signer } from 'ethers';
import constants from '../../../constants';
import { useSigner } from 'wagmi';
import { failureModal, successModal } from '../../../helpers/modal';
import { Buffer } from 'buffer';

const { useBreakpoint } = Grid;

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_PROJECT_SECRET;
const auth = 'Basic '.concat(
  Buffer.from(projectId?.concat(':').concat(projectSecret as string) as string).toString('base64'),
);
const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  apiPath: '/api/v0',
  headers: {
    authorization: auth,
  },
});

function CreateNFT() {
  const { md } = useBreakpoint();
  const [form] = Form.useForm();
  const [formInput, updateFormInput] = useState({ name: '', description: '' });
  const [fileType, setFileType] = useState('');
  const [fileName, setFileName] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [formValid, setFormValid] = useState({
    nameErr: false,
    descriptionErr: false,
    fileErr: false,
  });
  const [nameValid, setNameValid] = useState(false);
  const [descValid, setDescValid] = useState(false);
  const [isValidType, setIsValidType] = useState(true);
  const [mediaSrc, setMediaSrc] = useState<string>('');
  const [isValidFileName, setValidFileName] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [fileDataURL, setFileDataURL] = useState(null);
  const { data: signer } = useSigner();
  const nftMarketplace = new ethers.Contract(constants.MRKPLACE_ADDR, constants.MRKPLACE_ABI, signer as Signer);
  function checkValidType(file: { name: string; size: number | string }) {
    let result = false;
    // .JPG, .PNG, .MP4, .MP3, .WAV.
    const fileExtension = file.name.slice(-4).toLowerCase();
    const filesize = file.size;

    if (
      (fileExtension === '.jpg' ||
        fileExtension === 'jpeg' ||
        fileExtension === '.png' ||
        fileExtension === '.mp4' ||
        fileExtension === '.mp3' ||
        fileExtension === '.wav') &&
      filesize <= 52428800
    ) {
      result = true;
    }
    return result;
  }

  function checkValidName(name: string) {
    let extensionLength = 4;
    const fileExtension = name.slice(-5).toLowerCase();
    if (fileExtension === '.jpeg') {
      extensionLength = 5;
    }

    const _name = name.substring(0, name.length - extensionLength);
    // eslint-disable-next-line
    let format = /[^A-Z a-z0-9_-]/;
    return format.test(_name) ? false : true;
  }

  const onChangeImage = async (e: any) => {
    const file = e.target.files[0];
    console.log(e);
    if (file === undefined) {
      return;
    }
    console.log('File Info', file);
    setIsValidType(true);
    setFileName('');
    setFileType('');
    setValidFileName(true);

    if (!checkValidType(file)) {
      setIsValidType(false);
      return;
    }

    if (!checkValidName(file.name)) {
      setValidFileName(false);
      setFileName(file.name);
      return;
    }

    setFileName(file.name);
    setFileType(file.type);
    await uploadImageData(e);
  };

  const uploadImageData = async (e: any) => {
    const file = e.target.files[0];
    setPreviewFile(file);
    setLoadingImage(true);
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `ipfs://${added.path}`;
      setMediaSrc(url);
      setFileUrl(`https://ipfs.moralis.io:2053/ipfs/${added.path}`);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
    setLoadingImage(false);
  };

  function isFormValid() {
    if (formInput.name === '') {
      setFormValid({ ...formValid, nameErr: true });
      return false;
    }

    if (formInput.description === '') {
      setFormValid({ ...formValid, descriptionErr: true });
      return false;
    }

    if (fileName === '') {
      setFormValid({ ...formValid, fileErr: true });
      return false;
    }
    return true;
  }

  function checkValidInput(input: string) {
    if (input === '') {
      return true;
    }
    const format = /[^A-Z a-z0-9!@#$%^&*().,_+<>/?:"'|\\[={}`~\]\-\n]/;
    return format.test(input) ? false : true;
  }

  const handleInputName = (name: string) => {
    updateFormInput({ ...formInput, name });
    if (checkValidInput(name)) {
      setNameValid(true);
      return;
    }
    setNameValid(false);
  };

  const handleInputDesc = (description: string) => {
    updateFormInput({ ...formInput, description });
    if (checkValidInput(description)) {
      setDescValid(true);
      return;
    }
    setDescValid(false);
  };

  const errorDesField = () => {
    let errorDesMessage: string | undefined;
    if (!formInput.description && formValid.descriptionErr) {
      errorDesMessage = 'Please input your description';
    } else if (formInput.description && !descValid) {
      errorDesMessage = 'English only';
    } else {
      errorDesMessage = '';
    }
    return errorDesMessage;
  };

  const createNFT = async (imgUrl: any) => {
    const { name, description } = formInput;

    const data = JSON.stringify({ name, description, image: imgUrl, type: fileType });
    if (isFormValid()) {
      try {
        const added = await client.add(data);
        const url = `ipfs://${added.path}`;
        /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
        const createLoading = await nftMarketplace.createToken(url);
        await createLoading.wait();
        successModal('Success', 'Create NFT successfully');
      } catch (error) {
        console.log('Error uploading file: ', error);
      }
    }
  };

  async function handleCreateClicked() {
    if (signer) {
      if (!nameValid) {
        setFormValid({ ...formValid, nameErr: true });
        return;
      }
      if (!descValid) {
        setFormValid({ ...formValid, descriptionErr: true });
        return;
      }
      if (mediaSrc === '') {
        setFormValid({ ...formValid, fileErr: true });
      }
      setLoading(true);
      await createNFT(mediaSrc);
      setLoading(false);
    } else {
      failureModal('Error', 'Please connect your wallet first');
    }
  }

  // Show image preview when upload
  const PreviewHTML = () => {
    if (previewFile) {
      const fileReader = new window.FileReader();
      fileReader.onload = (e: any) => {
        const { result } = e.target;
        if (result) {
          setFileDataURL(result);
        }
      };
      fileReader.readAsDataURL(previewFile);
    }
    if (fileUrl && fileType?.includes('image')) {
      return (
        <img
          alt=""
          src={fileDataURL ? fileDataURL : ''}
          style={{
            margin: '10px 0 10px 0',
            width: '210px',
            height: '210px',
          }}
          width="350"
        />
      );
    }
    return <div></div>;
  };

  const ColRight = () => {
    let errorMessage: string | undefined;

    if (!fileName && formValid.fileErr) {
      errorMessage = 'Please upload your NFT file';
    } else if (!isValidFileName) {
      errorMessage = 'Please remove the special character in the filename';
    }
    return (
      <Col span={24} md={12} order={0}>
        <Form.Item>
          <label style={{ color: '#fff' }}>Image</label>
          <Input allowClear type="file" accept=".jpg,.jpeg,.mp4,.mp3,.png,.wav" onChange={onChangeImage} />
          {loadingImage ? <Spin /> : <PreviewHTML />}
          <div style={{ color: 'red' }}>{errorMessage}</div>
          <div style={{ color: 'red', fontSize: '12px', marginTop: '5px', fontWeight: 'bold' }}>
            supports JPG,JPEG,PNG,GIF,SVG,MPEG,MPG,MPEG3,MP3,MP4 files no larger than 40M
          </div>
        </Form.Item>
      </Col>
    );
  };

  const CollectionField = () => (
    <Form.Item>
      <label style={{ color: '#fff' }}>Collection</label>
      <Select
        style={{ width: '100%' }}
        defaultValue="Shared Collection"
        options={[
          {
            value: 'Shared Collection',
          },
        ]}
      />
    </Form.Item>
  );

  const UnlockableField = () => (
    <Form.Item>
      <label style={{ color: '#fff' }}>Unlockable(Optional)</label>
      <br />
      <Typography.Text type="secondary" style={{ color: '#fff' }}>
        The work is available to its owner only.
      </Typography.Text>
      <Input.TextArea
        className={styles.textArea}
        placeholder="You can add links and text description."
        rows={5}
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </Form.Item>
  );

  const CopyrightField = () => (
    <Form.Item>
      <label style={{ color: '#fff' }}>Copyright(Optional)</label>
      <Input.TextArea
        className={styles.textArea}
        placeholder="The creator has the copyright or use right to this work. You may not modify, copy, reproduce, transmit, or in anyway exploit any such content, without the authorization and consent of the creator. The creator reserve the right to take legal action against any infringement. "
        rows={5}
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </Form.Item>
  );

  const CreatBtn = () => {
    let textStatusCreate: string;
    if (loading) {
      textStatusCreate = 'Creating';
    } else {
      textStatusCreate = 'Create';
    }
    return (
      <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          className={styles.btnCreate}
          onClick={handleCreateClicked}
          loading={loading}
          disabled={!mediaSrc && fileType && isValidType ? true : false}
        >
          {textStatusCreate}
        </Button>
      </Col>
    );
  };

  return (
    <div className={styles.CreateWrapper}>
      <Form form={form} layout="vertical">
        <Row gutter={32}>
          <ColRight />
          <Col span={24} md={12}>
            <Row>
              <Typography.Title level={3} style={{ color: '#fff' }}>
                Create Works
              </Typography.Title>
              <Col span={24}>
                <Form.Item>
                  <label style={{ color: '#fff' }}>Work Name</label>
                  <Input
                    placeholder="Enter the name of the work"
                    style={{ border: '1px solid #d9d9d9', backgroundColor: '#fff' }}
                    value={formInput.name}
                    onChange={(e) => {
                      handleInputName(e.target.value);
                    }}
                  />
                  <div style={{ color: 'red' }}>
                    {!formInput.name && formValid.nameErr
                      ? 'Please input your asset name'
                      : formInput.name && !nameValid
                      ? 'English only'
                      : ''}
                  </div>
                </Form.Item>
              </Col>
              <Col span={24}>
                <CollectionField />
              </Col>
              <Col span={24}>
                <Form.Item>
                  <label style={{ color: '#fff' }}>Work Description</label>
                  <Input.TextArea
                    className={styles.textArea}
                    placeholder="Add description to the work"
                    rows={5}
                    style={{ whiteSpace: 'pre-wrap' }}
                    value={formInput.description}
                    onChange={(e) => {
                      handleInputDesc(e.target.value);
                    }}
                  />
                  <div style={{ color: 'red' }}>{errorDesField()}</div>
                </Form.Item>
              </Col>
              <Col span={24}>
                <UnlockableField />
              </Col>
              <Col span={24}>
                <CopyrightField />
              </Col>
            </Row>
            {md && <CreatBtn />}
          </Col>
          {!md && <CreatBtn />}
        </Row>
      </Form>
    </div>
  );
}

export default CreateNFT;
