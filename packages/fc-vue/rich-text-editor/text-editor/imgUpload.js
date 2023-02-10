function getError(action, option, xhr) {
  let msg
  if (xhr.response) {
    msg = `${xhr.status} ${xhr.response.error || xhr.response}`
  } else if (xhr.responseText) {
    msg = `${xhr.status} ${xhr.responseText}`
  } else {
    msg = `fail to post ${action} ${xhr.status}`
  }

  const err = new Error(msg)
  err.status = xhr.status
  err.method = 'post'
  err.url = action
  return err
}

function getBody(xhr) {
  const text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}

/**
 * @param {*} option option
 * {
 *    headers: this.headers,
 *    withCredentials: this.withCredentials,
 *    file: rawFile,
 *    data: this.data,
 *    filename: this.name,
 *    action: this.action,
 *    onProgress: e => {
 *      this.onProgress(e, rawFile);
 *    },
 *    onSuccess: res => {
 *      this.onSuccess(res, rawFile);
 *      delete this.reqs[uid];
 *    },
 *    onError: err => {
 *      this.onError(err, rawFile);
 *      delete this.reqs[uid];
 *    }
 * }
 */
export default function upload(option) {
  if (typeof XMLHttpRequest === 'undefined') {
    return
  }

  const xhr = new XMLHttpRequest()
  const action = option.action

  if (xhr.upload) {
    xhr.upload.onprogress = function progress(e) {
      if (e.total > 0) {
        e.percent = (e.loaded / e.total) * 100
      }
      if (option.onprogress) option.onProgress(e)
    }
  }

  const formData = new FormData()

  if (option.data) {
    Object.keys(option.data).map((key) => {
      formData.append(key, option.data[key])
    })
  }

  formData.append(option.filename, option.file)

  xhr.onerror = function error(e) {
    if (option.onError) option.onError(e)
  }

  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      if (option.onError) option.onError(getError(action, option, xhr))
      return
    }

    option.onSuccess(getBody(xhr))
  }

  xhr.open('post', action, true)

  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true
  }

  const headers = option.headers || {}

  for (const item in headers) {
    if (headers.hasOwnProperty(item) && headers[item] !== null) {
      xhr.setRequestHeader(item, headers[item])
    }
  }
  xhr.send(formData)
  return xhr
}
