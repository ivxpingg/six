package com.ikey.springbootmodule.controller;

import com.ikey.springbootcommon.util.*;
import com.ikey.springbootmodule.exception.GlobalException;
import com.ikey.springbootmodule.service.FileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;

/**
 * @description 文件上传
 * @author laughing
 * @date 2018-09-20 09:37:00
 */
@RestController
@RequestMapping(value = "/file")
@ConfigurationProperties(prefix = "fileConfig")
public class FileController {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Value("${fileConfig.path}")
    private String filePath;


    @Autowired
    private FileService fileService;


    /**
     * 文件上传
     *
     * @param multipartFile     上传的文件
     * @param response
     * @param request
     * @throws IOException
     */
    //@ApiOperation(value = "后台上传文件", notes = "后台上传文件")
    @PostMapping(value = "/upload/{fileType}")
    public String upload(@PathVariable("fileType") String fileType, @RequestParam("file") MultipartFile multipartFile,
                                    HttpServletResponse response, HttpServletRequest request) throws IOException {

        //安全校验 大小、格式
        boolean flag = FileUpTools.validate(multipartFile);
        if(!flag){
            throw new GlobalException(ExceptionType.E0012);
        }

        String uuid = FileUtils.createFileName();//创建文件名称

        String originalFileName = multipartFile.getOriginalFilename();//文件原名
        String fileExt = multipartFile.getOriginalFilename().substring(multipartFile.getOriginalFilename().lastIndexOf(".") + 1).toLowerCase();//扩展名

        String folderName = "attach/"+fileType + "/"+DateUtils.getDate();
        String realPath = request.getSession().getServletContext().getRealPath(folderName);
        String fileName =  uuid + "." + fileExt;//附件路径+类型（头像、附件等）+名称+扩展名
        File localFile = FileUtils.saveFileToDisk(multipartFile, realPath+"/"+fileName); //保存到磁盘
        if(localFile==null){
            return JsonUtil.getErrJson(ExceptionType.E0010);
        }
        //保存文件
        com.ikey.springbootmodule.entity.File file = new com.ikey.springbootmodule.entity.File(originalFileName,fileType,fileExt,folderName+"/"+fileName);
        boolean b = fileService.insert(file);
        if(!b){
            return JsonUtil.getErrJson(ExceptionType.E0010);
        }
        return JsonUtil.getSuccJson(file);
    }









}
