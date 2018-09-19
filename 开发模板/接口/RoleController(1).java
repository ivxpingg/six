package com.ikey.springbootmodule.controller;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.ikey.springbootcommon.util.ExceptionType;
import com.ikey.springbootcommon.util.JsonUtil;
import com.ikey.springbootmodule.entity.Role;
import com.ikey.springbootmodule.entity.RoleMenu;
import com.ikey.springbootmodule.exception.GlobalException;
import com.ikey.springbootmodule.service.RoleMenuService;
import com.ikey.springbootmodule.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Auther: laughing
 * @Date: 2018-9-12 14:04
 * @Description:
 */
@RestController
@RequestMapping("/role")
public class RoleController {

    @Autowired
    private RoleService roleService;
    @Autowired
    private RoleMenuService roleMenuService;

    @GetMapping("list")
    public String list(){
        //获得角色分组信息
        Map<String, List<Role>> map = new HashMap();
        EntityWrapper ew = new EntityWrapper();
        ew.orderBy("sort",true);
        List<Role> roleGroups = roleService.selectList(ew);
        for (Role roleGroup : roleGroups) {
            List<Role> parent = map.get(roleGroup.getParentId());
            if (parent == null) {
                parent = new ArrayList();
            }
            parent.add(roleGroup);
            map.put(roleGroup.getParentId(), parent);
        }
        List<Role> retList = MakeRole(map, "0");
        return JsonUtil.getSuccJson(ExceptionType.SUCCESS,retList);
    }

    private List<Role> MakeRole(Map<String, List<Role>> map, String roleId) {
        List<Role> roles = new ArrayList();
        List<Role> roleList = map.get(roleId);
        if (roleList != null) {
            for (Role me : roleList) {
                me.setChildren(MakeRole(map, me.getRoleId()));
                roles.add(me);
            }
        }
        return roles;
    }

    /**
     * 增加角色
     * @param role
     * @return
     */
    @PostMapping("/add")
    public String add(@RequestBody Role role){
        boolean result = roleService.insert(role);
        if (!result){
            throw new GlobalException(ExceptionType.E0002);
        }
        return JsonUtil.getSuccJson(ExceptionType.SUCCESS,role);
    }

    /**
     * 修改
     * @param role
     * @return
     */
    @PostMapping("/update")
    public String update(@RequestBody Role role){
        boolean result = role.updateById();
        if (!result){
            throw new GlobalException(ExceptionType.E0003);
        }
        return JsonUtil.getSuccJson(ExceptionType.SUCCESS,role);
    }

    /**
     * 查询
     * @param roleId
     * @return
     */
    @GetMapping("/query")
    public String query(@RequestParam(required = true)String roleId){
        Role role = roleService.selectById(roleId);
        return JsonUtil.getSuccJson(ExceptionType.SUCCESS,role);
    }


    /**
     * 获取角色菜单关联
     * @param roleId
     * @return
     */
    @GetMapping("/getRoleMenu")
    public String getRoleMenu(@RequestParam(name="roleId")String roleId){
        EntityWrapper ew = new EntityWrapper();
        ew.eq("ROLE_ID",roleId);
        List<RoleMenu> roleMenuList = roleMenuService.selectList(ew);
        return JsonUtil.getSuccJson(ExceptionType.SUCCESS,roleMenuList);
    }





    /**
     * 校验角色编号是否存在
     * @param roleNo
     * @return
     */
    @GetMapping("/checkRoleNo")
    public String checkRoleNo(@RequestParam(name = "roleNo")String roleNo){
        EntityWrapper ew = new EntityWrapper();
        ew.eq("ROLE_NO",roleNo);
        List<Role> roleList = roleService.selectList(ew);
        if(roleList!=null && !roleList.isEmpty()){
            return JsonUtil.getSuccJson(ExceptionType.SUCCESS,true);
        }
        return JsonUtil.getSuccJson(ExceptionType.SUCCESS,false);
    }

}
